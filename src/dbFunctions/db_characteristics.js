import conn from '../conn.js'

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
  
export async function getTiposProducto() {
    const result = await conn.query("SELECT * FROM tipo_producto")
    return result.rows.length > 0 ? result.rows : 'No posts found.'
}
  
// Añadir datos de tipo Producto
async function checkTipoProducto(tipo) {
  try {
    const result = await conn.query(
      "SELECT id_tipo FROM Tipo_producto WHERE nombre = $1",
      [tipo]
    );
    if (result.rows.length > 0) {
      return result.rows[0].id_tipo;
    }
    return 0;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

export async function addTipoProducto(tipo) {
  try {
    let exists = await checkTipoProducto(tipo);
    if (exists !== 0) {
      console.log('Esta categoría de producto ya existe.')
      return exists;
    }
    // Obtener el número de filas en la tabla
    const result = await conn.query('SELECT COUNT(*) AS count FROM Tipo_producto');
    const rowCount = parseInt(result.rows[0].count, 10);

    // Formar un nuevo índice basado en el número de filas
    const id_tipo = rowCount + 1;

    await conn.query(
      "INSERT INTO Tipo_producto (id_tipo, nombre) VALUES ($1, $2)", 
      [id_tipo, tipo]
    );
    return id_tipo;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
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
      return energia;
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
      
      return condiciones;
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
    }
}
  
  
// Añadir dato a size
async function checkSizeValue(min_gpm, max_gpm, range) {
    try {
      const result = await conn.query(
        `SELECT Size 
         FROM Size 
         WHERE min_gpm = $1 
           AND max_gpm = $2
           AND range = $3`,
        [min_gpm, max_gpm, range]
      );
      
      if (result.rows.length > 0) {
        // Si existe, devolver el 'Size'
        return result.rows[0].size;
      }
      return 0;
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
    }
}
  
export async function addSizeValue(min_gpm, max_gpm, range) {
    try {
      let exists = await checkSizeValue(min_gpm, max_gpm, range);
      
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
        `INSERT INTO Size (Size, min_gpm, max_gpm, range) 
         VALUES ($1, $2, $3, $4)`,
        [size, min_gpm, max_gpm, range]
      );
      
      return size;
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
    }
}
  
// Asociar todas las características al producto
export async function addCaracteristicas(caracteristicas) {
    const { 
      marca, material, profundidad, conexion_tuberia, presion_funcional, 
      head, flow_rate, aplicaciones, producto, energia, condiciones, temperatura_media 
    } = caracteristicas;
  
    try {
      let result = await conn.query(
        `INSERT INTO Características (marca, material, profundidad, conexion_tuberia, presion_funcional, head, flow_rate, aplicaciones, producto, energia, condiciones, temperatura_media) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [marca, material, profundidad, conexion_tuberia, presion_funcional, head, flow_rate, aplicaciones, producto, energia, condiciones, temperatura_media]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
    }
}

export async function updateCaracteristicas(caracteristicas) {
  const { 
    id_caracteristicas, marca, material, profundidad, conexion_tuberia, presion_funcional, 
    head, flow_rate, aplicaciones, producto, energia, condiciones, temperatura_media 
  } = caracteristicas;

  try {
    let result = await conn.query(
      `UPDATE Características 
       SET 
         marca = $1, material = $2, profundidad = $3, conexion_tuberia = $4,
         presion_funcional = $5, head = $6, flow_rate = $7, aplicaciones = $8, producto = $9,
         energia = $10, condiciones = $11, temperatura_media = $12
       WHERE id_caracteristicas = $13
       RETURNING *`,
      [marca, material, profundidad, conexion_tuberia, presion_funcional, head, flow_rate, aplicaciones, producto, energia, condiciones, temperatura_media, id_caracteristicas]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

// Características variables
export async function addVariables(caracteristicas_variables) {
  const { 
    id_caracteristicas, size, precio, disponibilidad
  } = caracteristicas_variables;

  try {
    let result = await conn.query(
      `INSERT INTO caracteristicas_variables (id_caracteristicas, size, precio, disponibilidad) 
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_caracteristicas, size, precio, disponibilidad]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

export async function updateVariables(caracteristicas_variables) {
  const { 
    id_caracteristicas, size, precio, disponibilidad
  } = caracteristicas_variables;

  try {
    let result = await conn.query(
      `UPDATE caracteristicas_variables 
      SET 
        precio = $3, disponibilidad = $4
      WHERE id_caracteristicas = $1 AND size = $2
      RETURNING *`,
      [id_caracteristicas, size, precio, disponibilidad]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}
