import conn from './conn.js'

export async function getProductos () {
  const result = await conn.query('SELECT * FROM Productos')
  return result.rows.length > 0 ? result.rows : 'No posts found.'
}

// Obtener productos por ID
export async function getProductById(productId) {
  try {
    const result = await conn.query('SELECT * FROM Productos WHERE id_producto = $1', [productId]);
    if (result.rows.length === 1) {
      return result.rows[0]; // Devuelve el primer producto encontrado
    }
    return false;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

// Eliminar producto
export async function deleteProduct(productId) {
  try {
    await conn.query('DELETE FROM Productos WHERE id_producto = $1', [productId]);
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}
export async function updateProduct(productId, nombre, descripción, precio, disponibilidad, tipo_producto) {
  try {
    const result = await conn.query(
      'UPDATE Productos SET nombre = $1, descripción = $2, precio = $3, disponibilidad = $4, tipo_producto = $5 WHERE id_producto = $6',
      [nombre, descripción, precio, disponibilidad, tipo_producto, productId]
    );
    return result.rowCount > 0; // Devuelve true si se actualizó al menos un registro
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

//Ingresar Pedidos 
export async function savePurchase(clienteId, productos, nitEmpresa, idDescuento) {
  try {
    await conn.query('BEGIN');

    // Crear nuevo pedido
    const pedidoResult = await conn.query(
      'INSERT INTO Pedidos (estatus) VALUES ($1) RETURNING id_pedido',
      [1] // Puedes definir el estado inicial aquí
    );
    const pedidoId = pedidoResult.rows[0].id_pedido;

    // Insertar productos en Recuento
    for (let producto of productos) {
      await conn.query(
        'INSERT INTO Recuento (Pedido_Fk, Producto_Fk, Cantidad) VALUES ($1, $2, $3)',
        [pedidoId, producto.idProducto, producto.cantidad]
      );
    }

    // Calcular el monto total
    let montoTotal = 0;
    for (let producto of productos) {
      const productoData = await conn.query(
        'SELECT precio FROM Productos WHERE id_producto = $1',
        [producto.idProducto]
      );
      montoTotal += productoData.rows[0].precio * producto.cantidad;
    }

    // Aplicar descuento si existe
    if (idDescuento) {
      const descuentoData = await conn.query(
        'SELECT descuento FROM Codigos WHERE id_codigo = $1 AND validez = TRUE',
        [idDescuento]
      );
      if (descuentoData.rowCount > 0) {
        const descuento = descuentoData.rows[0].descuento;
        montoTotal *= 1 - descuento / 100;
      }
    }

    // Crear factura
    await conn.query(
      'INSERT INTO Factura (id_cliente, id_pedido, nit_empresa, monto_total, id_descuento) VALUES ($1, $2, $3, $4, $5)',
      [clienteId, pedidoId, nitEmpresa, montoTotal, idDescuento]
    );

    await conn.query('COMMIT');
    return { success: true };
  } catch (error) {
    await conn.query('ROLLBACK');
    console.error('Error en la transacción:', error);
    return { success: false, message: 'Error al guardar la compra.', error: error.message };
  }
}

// Crear producto
export async function createProduct(product) {
  const { nombre, descripción, precio, disponibilidad, tipo_producto } = product;
  const query = `
    INSERT INTO Productos (nombre, descripción, precio, disponibilidad, tipo_producto)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [nombre, descripción, precio, disponibilidad, tipo_producto];
  try {
    const result = await conn.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}
