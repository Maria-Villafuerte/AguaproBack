import conn from '../conn.js'

// Obtener todos los productos
export async function getProductos () {
    const result = await conn.query(`SELECT *
      FROM Productos p
      JOIN tipo_producto u ON p.tipo_producto = u.id_tipo`)
    return result.rows.length > 0 ? result.rows : 'No posts found.'
}

// Obtener todos los productos EN VENTA
export async function getVisibleProducts() {
  const result = await conn.query(`SELECT *
    FROM Productos p
    JOIN tipo_producto u ON p.tipo_producto = u.id_tipo
    WHERE estado = 'en venta'`)
  return result.rows.length > 0 ? result.rows : 'No posts found.'
}

// Obtener todos los productos OCULTO
export async function getOcultoProducts() {
  const result = await conn.query(`SELECT *
    FROM Productos p
    JOIN tipo_producto u ON p.tipo_producto = u.id_tipo
    WHERE estado = 'oculto'`)
  return result.rows.length > 0 ? result.rows : 'No posts found.'
}


// Obtener productos por ID
export async function getProductById(productId) {
    try {
      const result = await conn.query(`SELECT *
      FROM Productos p
      JOIN tipo_producto u ON p.tipo_producto = u.id_tipo
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

// Editar producto
export async function updateProduct(productId, nombre, descripción, tipo_producto) {
    try {
        const result = await conn.query(
        'UPDATE Productos SET nombre = $1, descripción = $2, tipo_producto = $3 WHERE id_producto = $4',
        [nombre, descripción, tipo_producto, productId]
        );
        return result.rowCount > 0; // Devuelve true si se actualizó al menos un registro
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        throw error;
    }
}

// Editar disponibilidad producto
export async function updateProductDisp(productId, size, disponibilidad) {
  try {
      const result = await conn.query(
      `UPDATE caracteristicas_variables SET disponibilidad = $3 
      WHERE size = $2 AND id_caracteristicas = (SELECT id_caracteristicas FROM características WHERE producto = $1)`,
      [productId, size, disponibilidad]
      );
      return result.rowCount > 0; // Devuelve true si se actualizó al menos un registro
  } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
  }
}

// Crear producto
export async function createProduct(product) {
    const { nombre, descripción, tipo_producto } = product;
  
    // Obtener el número de filas en la tabla
    const result = await conn.query('SELECT COUNT(*) AS count FROM Productos');
    const rowCount = parseInt(result.rows[0].count, 10);
  
    // Formar un nuevo índice basado en el número de filas
    const producto = rowCount + 1;
  
    const query = `
      INSERT INTO Productos (id_producto, nombre, descripción, tipo_producto)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [producto, nombre, descripción, tipo_producto];
    try {
      const result = await conn.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
    }
}