import conn from './conn.js'

export async function getProductos () {
  const result = await conn.query('SELECT * FROM Productos')
  return result.rows.length > 0 ? result.rows : 'No posts found.'
}

