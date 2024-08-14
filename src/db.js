import conn from './conn.js'

export async function getProductos () {
  const result = await conn.query("SELECT * FROM Productos WHERE estado = 'en venta'")
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
  capacitor = capacitor.toLowerCase();
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
      console.log('Esta combinación de condiciones ya existe.')
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
      console.log('Esa combinación de Size ya existe en la posición')
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
export async function addCaracteristicas(marca, size, material, profundidad, conexion_tuberia, presion_funcional, head, flow_rate, aplicaciones, producto, energia, condiciones, temperatura_media) {
  marca = marca.toLowerCase()
  material = material.toLowerCase()
  conexion_tuberia = conexion_tuberia.toLowerCase()
  aplicaciones = aplicaciones.toLowerCase()

  try {
    await conn.query(
      `INSERT INTO Características (marca, size, material, profundidad, conexion_tuberia, presion_funcional, head, flow_rate, aplicaciones, producto, energia, condiciones, temperatura_media) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [marca, size, material, profundidad, conexion_tuberia, presion_funcional, head, flow_rate, aplicaciones, producto, energia, condiciones, temperatura_media]
    );
    
    return "Creado";
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}
