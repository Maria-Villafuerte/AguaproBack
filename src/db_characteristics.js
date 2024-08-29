import conn from './conn.js'

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
        return result.rows[0].Size;
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