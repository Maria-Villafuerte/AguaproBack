import conn from '../conn.js'

//Ver valores de características
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

    await conn.query(
      "INSERT INTO Tipo_producto (nombre) VALUES ($1)", 
      [tipo]
    );
    return id_tipo;
  } catch (error) {
    console.error('Error en la consulta SQL:', error);
    throw error;
  }
}