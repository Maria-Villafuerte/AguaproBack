import conn from '../conn.js'

export async function savePurchase(clienteId, productos, nitEmpresa, idDescuento, direccion) {
  try {
    await conn.query('BEGIN');

    // Validar entradas
    if (!clienteId || !productos || !Array.isArray(productos) || !nitEmpresa) {
      throw new Error('Datos de entrada inválidos');
    }

    const maxIdResult = await conn.query('SELECT MAX(id_pedido) FROM Pedidos');
    const maxId = maxIdResult.rows[0].max || 0;
    const newPedidoId = maxId + 1;

    // Insertar en Pedidos
    const pedidoResult = await conn.query(
      'INSERT INTO Pedidos (id_pedido, estatus, direccion) VALUES ($1, $2, $3) RETURNING id_pedido',
      [newPedidoId, 1, direccion]
    );
    const pedidoId = pedidoResult.rows[0].id_pedido;

    let montoTotal = 0;

    // Insertar productos en Recuento y calcular montoTotal en el mismo paso
    for (let producto of productos) {
      const precioProducto = await conn.query(
        'SELECT precio FROM Productos WHERE id_producto = $1',
        [producto.idProducto]
      );

      if (precioProducto.rowCount === 0) {
        throw new Error(`Producto con id ${producto.idProducto} no encontrado`);
      }

      let precioUnitario = precioProducto.rows[0].precio;

      await conn.query(
        'INSERT INTO Recuento (Pedido_Fk, Producto_Fk, Cantidad, Precio_unitario) VALUES ($1, $2, $3, $4)',
        [pedidoId, producto.idProducto, producto.cantidad, precioUnitario]
      );

      // Aplicar descuento si existe
      if (idDescuento) {
        const descuentoData = await conn.query(
          'SELECT descuento FROM Codigos WHERE id_codigo = $1 AND validez = TRUE AND producto = $2',
          [idDescuento, producto.idProducto]
        );

        if (descuentoData.rowCount > 0) {
          const descuento = descuentoData.rows[0].descuento;
          if (descuento < 0 || descuento > 100) {
            throw new Error('Descuento inválido');
          }
          precioUnitario *= 1 - descuento / 100; // Aplicar descuento
        }
      }

      // Calcular el monto total mientras se insertan los productos
      montoTotal += precioUnitario * producto.cantidad;
    }

    // Insertar en Factura
    await conn.query(
      'INSERT INTO Factura (id_cliente, id_pedido, nit_empresa, monto_total, id_descuento) VALUES ($1, $2, $3, $4, $5)',
      [clienteId, pedidoId, nitEmpresa, montoTotal, idDescuento]
    );

    await conn.query('COMMIT');
    return { success: true, pedidoId: pedidoId, monto: montoTotal };
  } catch (error) {
    await conn.query('ROLLBACK');
    console.error('Error en la transacción:', error);
    return { success: false, message: 'Error al guardar la compra.', error: error.message };
  }
}

export async function deletePurchase(pedidoId) {
  try {
    await conn.query('BEGIN');

    await conn.query('DELETE FROM Recuento WHERE Pedido_Fk = $1', [pedidoId]);
    await conn.query('DELETE FROM Factura WHERE id_pedido = $1', [pedidoId]);

    const deleteResult = await conn.query(
      'DELETE FROM Pedidos WHERE id_pedido = $1 RETURNING id_pedido',
      [pedidoId]
    );

    if (deleteResult.rowCount === 0) {
      throw new Error('Pedido no encontrado');
    }

    await conn.query('COMMIT');
    return { success: true, message: 'Pedido eliminado exitosamente.' };
  } catch (error) {
    await conn.query('ROLLBACK');
    console.error('Error en la transacción:', error);
    return { success: false, message: 'Error al eliminar el pedido.', error: error.message };
  }
}

export async function getAllPedidos() {
  try {
    const query = `
      SELECT 
        p.id_pedido, 
        p.estatus, 
        p.direccion, 
        te.nombre AS estado, 
        c.id_cliente, 
        c.nombre AS cliente, 
        c.email AS contacto,
        f.monto_total, 
        f.nit_empresa, 
        f.id_descuento
      FROM Pedidos p
      JOIN Tipos_estados te ON p.estatus = te.id_estado
      JOIN Factura f ON p.id_pedido = f.id_pedido
      JOIN Clientes c ON f.id_cliente = c.id_cliente
    `;
    const result = await conn.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

export async function getPedidoById(pedidoId) {
  try {
    const query = `
      SELECT 
        p.id_pedido, 
        p.estatus, 
        p.direccion, 
        te.nombre AS estado, 
        c.id_cliente, 
        c.nombre AS cliente, 
        c.email AS contacto,
        f.monto_total, 
        f.nit_empresa, 
        f.id_descuento
      FROM Pedidos p
      JOIN Tipos_estados te ON p.estatus = te.id_estado
      JOIN Factura f ON p.id_pedido = f.id_pedido
      JOIN Clientes c ON f.id_cliente = c.id_cliente
      WHERE p.id_pedido = $1
    `;
    const result = await conn.query(query, [pedidoId]);
    return result.rows.length === 1 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

export async function getPedidosByEstado(estadoId) {
  try {
    const query = `
      SELECT 
        p.id_pedido, 
        p.estatus, 
        p.direccion, 
        te.nombre AS estado, 
        c.id_cliente, 
        c.nombre AS cliente, 
        f.monto_total, 
        f.nit_empresa, 
        f.id_descuento,
        f.created_date
      FROM Pedidos p
      JOIN Tipos_estados te ON p.estatus = te.id_estado
      JOIN Factura f ON p.id_pedido = f.id_pedido
      JOIN Clientes c ON f.id_cliente = c.id_cliente
      WHERE p.estatus = $1
      ORDER BY f.created_date
    `;
    const result = await conn.query(query, [estadoId]);
    return result.rows;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

export async function getProductosByPedido(pedidoId) {
  try {
    const query = `
      SELECT *
      FROM Recuento r
      JOIN Productos pr ON r.Producto_Fk = pr.id_producto
      JOIN Tipo_producto tp ON pr.tipo_producto = tp.id_tipo
      WHERE r.Pedido_Fk = $1
    `;
    const result = await conn.query(query, [pedidoId]);
    return result.rows;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

export async function updatePedidoStatus(pedidoId, estatus) {
  try {
    await conn.query('BEGIN');

    const updateResult = await conn.query(
      'UPDATE Pedidos SET estatus = $1 WHERE id_pedido = $2 RETURNING id_pedido',
      [estatus, pedidoId]
    );

    if (updateResult.rowCount === 0) {
      throw new Error(`No se encontró el pedido con ID ${pedidoId}`);
    }

    await conn.query('COMMIT');
    return { 
      success: true, 
      message: 'Estado del pedido actualizado exitosamente.',
      pedidoId: pedidoId
    };
  } catch (error) {
    await conn.query('ROLLBACK');
    console.error('Error en la transacción:', error);
    return { 
      success: false, 
      message: 'Error al actualizar el estado del pedido.', 
      error: error.message 
    };
  }
}

export async function updatePedidoDireccion(pedidoId, direccion) {
  try {
    await conn.query('BEGIN');

    const updateResult = await conn.query(
      'UPDATE Pedidos SET direccion = $1 WHERE id_pedido = $2 RETURNING id_pedido',
      [direccion, pedidoId]
    );

    if (updateResult.rowCount === 0) {
      throw new Error(`No se encontró el pedido con ID ${pedidoId}`);
    }

    await conn.query('COMMIT');
    return { 
      success: true, 
      message: 'Dirección del pedido actualizada exitosamente.',
      pedidoId: pedidoId
    };
  } catch (error) {
    await conn.query('ROLLBACK');
    console.error('Error en la transacción:', error);
    return { 
      success: false, 
      message: 'Error al actualizar la dirección del pedido.', 
      error: error.message 
    };
  }
}

export async function updateProductosByPedido(pedidoId, productos) {
  try {
    await conn.query('BEGIN');

    // Eliminar los productos existentes del pedido
    await conn.query('DELETE FROM Recuento WHERE Pedido_Fk = $1', [pedidoId]);

    // Insertar los nuevos productos
    for (let producto of productos) {
      await conn.query(
        'INSERT INTO Recuento (Pedido_Fk, Producto_Fk, Cantidad) VALUES ($1, $2, $3)',
        [pedidoId, producto.idProducto, producto.cantidad]
      );
    }

    // Recalcular el monto total
    let montoTotal = 0;
    for (let producto of productos) {
      const productoData = await conn.query(
        `SELECT cv.precio 
         FROM Productos p
         JOIN Recuento r ON p.id_producto = r.producto_fk
         WHERE p.id_producto = $1 AND r.pedido_fk = $2`,
        [producto.idProducto, pedidoId]
      );
      montoTotal += productoData.rows[0].precio * producto.cantidad;
    }

    // Actualizar el monto total en la factura
    await conn.query(
      'UPDATE Factura SET monto_total = $1 WHERE id_pedido = $2',
      [montoTotal, pedidoId]
    );

    await conn.query('COMMIT');
    return { success: true, message: 'Productos del pedido actualizados exitosamente.' };
  } catch (error) {
    await conn.query('ROLLBACK');
    console.error('Error en la transacción:', error);
    return { success: false, message: 'Error al actualizar los productos del pedido.', error: error.message };
  }
}

export async function searchPedidos(searchTerm) {
  try {
    const query = `
      SELECT DISTINCT
        p.id_pedido, 
        p.estatus, 
        p.direccion, 
        te.nombre AS estado, 
        c.id_cliente, 
        c.nombre AS cliente, 
        f.monto_total, 
        f.nit_empresa, 
        f.id_descuento,
        STRING_AGG(DISTINCT prod.nombre, ', ') AS productos
      FROM Pedidos p
      JOIN Tipos_estados te ON p.estatus = te.id_estado
      JOIN Factura f ON p.id_pedido = f.id_pedido
      JOIN Clientes c ON f.id_cliente = c.id_cliente
      LEFT JOIN Recuento r ON p.id_pedido = r.Pedido_Fk
      LEFT JOIN Productos prod ON r.Producto_Fk = prod.id_producto
      WHERE 
        c.nombre ILIKE $1 OR
        f.nit_empresa ILIKE $1 OR
        p.direccion ILIKE $1 OR
        prod.nombre ILIKE $1
      GROUP BY 
        p.id_pedido, 
        te.nombre, 
        c.id_cliente, 
        c.nombre, 
        f.monto_total, 
        f.nit_empresa, 
        f.id_descuento
    `;
    const result = await conn.query(query, [`%${searchTerm}%`]);
    return result.rows;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}
