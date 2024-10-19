import conn from '../conn.js'

//Ver valores de características
export async function getTiposProducto() {
    const result = await conn.query("SELECT * FROM tipo_producto")
    return result.rows.length > 0 ? result.rows : 'No posts found.'
}

export async function getCapacidad() {
  const result = await conn.query("SELECT * FROM capacidad")
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

// Función para verificar si una capacidad con el mismo cap_min y cap_max ya existe
async function checkCapacidad(cap_min, cap_max) {
  try {
    const result = await conn.query(
      "SELECT id_capacidad FROM Capacidad WHERE cap_min = $1 AND cap_max = $2",
      [cap_min, cap_max]
    );
    if (result.rows.length > 0) {
      return result.rows[0].id_capacidad;
    }
    return 0;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}

// Función para agregar una nueva capacidad
export async function addCapacidad(cap_min, cap_max) {
  try {
    // Verificar si ya existe una capacidad con los mismos valores
    let exists = await checkCapacidad(cap_min, cap_max);
    if (exists !== 0) {
      console.log('Esta capacidad ya existe.');
      return exists;
    }

    // Obtener el número de filas en la tabla Capacidad
    const result = await conn.query('SELECT COUNT(*) AS count FROM Capacidad');
    const rowCount = parseInt(result.rows[0].count, 10);

    // Formar un nuevo índice basado en el número de filas
    const id_capacidad = rowCount + 1;

    // Insertar la nueva capacidad en la tabla
    await conn.query(
      "INSERT INTO Capacidad (id_capacidad, cap_min, cap_max) VALUES ($1, $2, $3)", 
      [id_capacidad, cap_min, cap_max]
    );
    return id_capacidad;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}
