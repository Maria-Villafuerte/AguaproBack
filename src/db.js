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