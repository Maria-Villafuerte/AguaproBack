import conn from './conn.js'
import bcrypt from 'bcrypt';

export async function getProductos () {
  const result = await conn.query(`SELECT p.id_producto, p.nombre, p.descripción, 
    p.precio, p.disponibilidad, p.tipo_producto, c.marca, c.material, c.profundidad, c.conexion_tuberia, 
    c.presion_funcional, c.head, c.flow_rate, c.aplicaciones, c.temperatura_media, s.min_gpm, 
    s.max_gpm, e.min_hp, e.max_hp, e.capacitor, t.temperatura_liquida_min, t.temperatura_liquida_max, 
    t.temperatura_ambiente, t.presion FROM Productos p
    JOIN características c ON p.id_producto = c.producto
    JOIN size s ON c.size = s.size
    JOIN energía e ON c.energia = e.energia
    JOIN condiciones t ON c.condiciones = t.condiciones
    WHERE estado = 'en venta'`)
  return result.rows.length > 0 ? result.rows : 'No posts found.'
}

// Obtener productos por ID
export async function getProductById(productId) {
  try {
    const result = await conn.query(`SELECT p.id_producto, p.nombre, p.descripción, 
    p.precio, p.disponibilidad, p.tipo_producto, c.marca, c.material, c.profundidad, c.conexion_tuberia, 
    c.presion_funcional, c.head, c.flow_rate, c.aplicaciones, c.temperatura_media, s.min_gpm, 
    s.max_gpm, e.min_hp, e.max_hp, e.capacitor, t.temperatura_liquida_min, t.temperatura_liquida_max, 
    t.temperatura_ambiente, t.presion FROM Productos p
    JOIN características c ON p.id_producto = c.producto
    JOIN size s ON c.size = s.size
    JOIN energía e ON c.energia = e.energia
    JOIN condiciones t ON c.condiciones = t.condiciones
    WHERE id_producto = $1`, [productId]);
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
    await conn.query("UPDATE Productos SET estado = 'oculto' WHERE id_producto = $1", [productId]);
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

// Crear producto
export async function createProduct(product) {
  const { nombre, descripción, precio, disponibilidad, tipo_producto } = product;

  // Obtener el número de filas en la tabla
  const result = await conn.query('SELECT COUNT(*) AS count FROM Productos');
  const rowCount = parseInt(result.rows[0].count, 10);

  // Formar un nuevo índice basado en el número de filas
  const producto = rowCount + 1;

  const query = `
    INSERT INTO Productos (id_producto, nombre, descripción, precio, disponibilidad, tipo_producto)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [producto, nombre, descripción, precio, disponibilidad, tipo_producto];
  try {
    const result = await conn.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

//Ver valores de características
export async function getSize () {
  const result = await conn.query("SELECT * FROM Size")
  return result.rows.length > 0 ? result.rows : 'No posts found.'
}

export async function getConditions () {
  const result = await conn.query("SELECT * FROM Condiciones")
  return result.rows.length > 0 ? result.rows : 'No posts found.'
}

export async function getEnergia () {
  const result = await conn.query("SELECT * FROM Energía")
  return result.rows.length > 0 ? result.rows : 'No posts found.'
}

// Añadir datos de energía
async function checkEnergyValue(min_hp, max_hp, capacitor) {
  try {
    const result = await conn.query(
      "SELECT energia FROM Energía WHERE min_hp = $1 AND max_hp = $2 AND capacitor = $3",
      [min_hp, max_hp, capacitor]
    );
    if (result.rows.length > 0) {
      // Si existe, devolver el 'energia'
      return result.rows[0].energia;
    }
    return 0;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

export async function addEnergyValue(min_hp, max_hp, capacitor) {
  try {
    let exists = await checkEnergyValue(min_hp, max_hp, capacitor);
    if (exists !== 0) {
      console.log('Este dato de energía ya existe.')
      return exists;
    }
    // Obtener el número de filas en la tabla
    const result = await conn.query('SELECT COUNT(*) AS count FROM Energía');
    const rowCount = parseInt(result.rows[0].count, 10);

    // Formar un nuevo índice basado en el número de filas
    const energia = rowCount + 1;

    await conn.query(
      "INSERT INTO Energía (energia, min_hp, max_hp, capacitor) VALUES ($1, $2, $3, $4)", 
      [energia, min_hp, max_hp, capacitor]
    );
    return "Creado";
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}


// Añadir datos de condiciones
async function checkConditionValue(Temperatura_liquida_min, Temperatura_liquida_max, Temperatura_Ambiente, presion) {
  try {
    const result = await conn.query(
      `SELECT condiciones 
       FROM Condiciones 
       WHERE Temperatura_liquida_min = $1 
         AND Temperatura_liquida_max = $2 
         AND Temperatura_Ambiente = $3 
         AND presion = $4`,
      [Temperatura_liquida_min, Temperatura_liquida_max, Temperatura_Ambiente, presion]
    );
    
    if (result.rows.length > 0) {
      // Si existe, devolver el 'condiciones'
      return result.rows[0].condiciones;
    }
    return 0;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

export async function addConditionValue(Temperatura_liquida_min, Temperatura_liquida_max, Temperatura_Ambiente, presion) {
  try {
    let exists = await checkConditionValue(Temperatura_liquida_min, Temperatura_liquida_max, Temperatura_Ambiente, presion);
    
    if (exists !== 0) {
      console.log('Ese dato de condiciones ya existe.')
      return exists;
    }

    // Obtener el número de filas en la tabla
    const result = await conn.query('SELECT COUNT(*) AS count FROM Condiciones');
    const rowCount = parseInt(result.rows[0].count, 10);

    // Formar un nuevo índice basado en el número de filas
    const condiciones = rowCount + 1;
    
    await conn.query(
      `INSERT INTO Condiciones (condiciones, Temperatura_liquida_min, Temperatura_liquida_max, Temperatura_Ambiente, presion) 
       VALUES ($1, $2, $3, $4, $5)`,
      [condiciones, Temperatura_liquida_min, Temperatura_liquida_max, Temperatura_Ambiente, presion]
    );
    
    return "Creado";
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}


// Añadir dato a size
async function checkSizeValue(min_gpm, max_gpm) {
  try {
    const result = await conn.query(
      `SELECT Size 
       FROM Size 
       WHERE min_gpm = $1 
         AND max_gpm = $2`,
      [min_gpm, max_gpm]
    );
    
    if (result.rows.length > 0) {
      // Si existe, devolver el 'Size'
      return result.rows[0].Size;
    }
    return 0;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

export async function addSizeValue(min_gpm, max_gpm) {
  try {
    let exists = await checkSizeValue(min_gpm, max_gpm);
    
    if (exists !== 0) {
      console.log('Ese dato de Size ya existe')
      return exists;
    }

    // Obtener el número de filas en la tabla
    const result = await conn.query('SELECT COUNT(*) AS count FROM Size');
    const rowCount = parseInt(result.rows[0].count, 10);

    // Formar un nuevo índice basado en el número de filas
    const size = rowCount + 1;
    
    await conn.query(
      `INSERT INTO Size (Size, min_gpm, max_gpm) 
       VALUES ($1, $2, $3)`,
      [size, min_gpm, max_gpm]
    );
    
    return "Creado";
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

// Asocial todas las características al producto
export async function addCaracteristicas(caracteristicas) {
  const { 
    marca, size, material, profundidad, conexion_tuberia, presion_funcional, 
    head, flow_rate, aplicaciones, producto, energia, condiciones, temperatura_media 
  } = caracteristicas;

  try {
    let result = await conn.query(
      `INSERT INTO Características (marca, size, material, profundidad, conexion_tuberia, presion_funcional, head, flow_rate, aplicaciones, producto, energia, condiciones, temperatura_media) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [marca, size, material, profundidad, conexion_tuberia, presion_funcional, head, flow_rate, aplicaciones, producto, energia, condiciones, temperatura_media]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

export async function getAllPedidos() {
  try {
    const result = await conn.query('SELECT * FROM Pedidos');
    return result.rows;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    
export async function getPedidoById(pedidoId) {
  try {
    const result = await conn.query('SELECT * FROM Pedidos WHERE id_pedido = $1', [pedidoId]);
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
    const result = await conn.query('SELECT * FROM Pedidos WHERE estatus = $1', [estadoId]);
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

