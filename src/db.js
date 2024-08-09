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