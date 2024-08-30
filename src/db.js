import conn from './conn.js'
import bcrypt from 'bcrypt';

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

export async function deletePurchase(pedidoId) {
  try {
    await conn.query('BEGIN');

    // Eliminar registros en Recuento asociados al pedido
    await conn.query(
      'DELETE FROM Recuento WHERE Pedido_Fk = $1',
      [pedidoId]
    );

    // Eliminar factura asociada al pedido
    await conn.query(
      'DELETE FROM Factura WHERE id_pedido = $1',
      [pedidoId]
    );

    // Eliminar el pedido
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
        te.nombre AS estado, 
        c.id_cliente, 
        c.nombre AS cliente, 
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
  }
}
export async function getPedidoById(pedidoId) {
  try {
    const query = `
      SELECT 
        p.id_pedido, 
        p.estatus, 
        te.nombre AS estado, 
        c.id_cliente, 
        c.nombre AS cliente, 
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
    if (result.rows.length === 1) {
      return result.rows[0]; // Devuelve el pedido encontrado
    }
    return null;
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
        te.nombre AS estado, 
        c.id_cliente, 
        c.nombre AS cliente, 
        f.monto_total, 
        f.nit_empresa, 
        f.id_descuento
      FROM Pedidos p
      JOIN Tipos_estados te ON p.estatus = te.id_estado
      JOIN Factura f ON p.id_pedido = f.id_pedido
      JOIN Clientes c ON f.id_cliente = c.id_cliente
      WHERE p.estatus = $1
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
      SELECT 
        pr.id_producto, 
        pr.nombre, 
        pr.precio, 
        tp.nombre AS tipo_producto,
        r.cantidad
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

// Account Controller
export async function registerUser(username, password, email, role = 'user') {
  try {
    const saltRounds = 10; // Número de salt rounds para bcrypt

    console.log('Password received:', password); // Imprime la contraseña para depurar

    if (!password || typeof password !== 'string') {
      throw new Error('Invalid password');
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Generar el hash de la contraseña
    const sql = 'INSERT INTO users (username, password_hash, email, role) VALUES ($1, $2, $3, $4)';  // Insertar el usuario en la base de datos
    await conn.query(sql, [username, hashedPassword, email, role]);

    return true;
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    throw error;
  }
}

export async function loginUser(username, password) {
  const sql = 'SELECT id, username, password_hash, email, role FROM users WHERE username = $1';
  const result = await conn.query(sql, [username]);

  if (result.rows.length > 0) {
    const user = result.rows[0];

    // Compara la contraseña ingresada con el hash almacenado
    const match = await bcrypt.compare(password, user.password_hash);

    if (match) {
      // Si la contraseña coincide, devuelve los datos del usuario
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };
    } else {
      return null; // Contraseña incorrecta
    }
  } else {
    return null; // Usuario no encontrado
  }
}

export async function getUserById (id) {
  const sql = 'SELECT * FROM users WHERE id = $1'
  const result = await conn.query(sql, [id])
  return result.rows[0].length > 0 ? 'No user found.' : result.rows
}
export async function getUsers () {
  const sql = 'SELECT * FROM users'
  const result = await conn.query(sql)
  return result.rows.length > 0 ? result.rows : 'No users found.'
}

