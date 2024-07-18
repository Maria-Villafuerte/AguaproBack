import conn from './conn.js'

export async function getProductos () {
  const result = await conn.query('SELECT * FROM Productos')
  return result.rows.length > 0 ? result.rows : 'No posts found.'
}

// Obtener productos por ID
export async function getProductById(productId) {
  const [rows] = await conn.query('SELECT * FROM Productos WHERE id_producto = ?', [productId]);
  return rows[0] || null; // Retorna el primer producto encontrado o null si no se encuentra ningún post
}

// Eliminar producto
export async function deleteProduct(productId) {
  await conn.query('DELETE FROM Productos WHERE id_producto = ?', [productId])
}