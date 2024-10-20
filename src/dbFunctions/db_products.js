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
export async function updateProduct(id_producto, nombre, marca, modelo, descripción, 
    material, tipo_producto, capacidad, precio, disponibilidad) {
    try {
      const query = `
      UPDATE Productos 
      SET 
        nombre = $1, marca = $2, modelo = $3, descripción = $4, material = $5, tipo_producto = $6, 
        capacidad = $7, precio = $8, disponibilidad = $9 WHERE id_producto = $10`;
    
      const values = [ nombre, marca, modelo, descripción, material, tipo_producto, capacidad, precio, disponibilidad, id_producto];
    
      const result = await conn.query(query, values);    
      return result.rowCount > 0; // Devuelve true si se actualizó al menos un registro
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        throw error;
    }
}

// Editar disponibilidad producto
export async function updateProductDisp(productId, disponibilidad) {
  try {
      const result = await conn.query(
      `UPDATE Productos SET disponibilidad = $2 
      WHERE id_producto = $1`,
      [productId, disponibilidad]
      );
      return result.rowCount > 0; // Devuelve true si se actualizó al menos un registro
  } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
  }
}

// Crear producto
export async function createProduct(product) {
    const { nombre, marca, modelo, descripción, 
      material, tipo_producto, capacidad, precio, disponibilidad
     } = product;
    // Obtener el número de filas en la tabla
    const result = await conn.query('SELECT COUNT(*) AS count FROM Productos');
    const rowCount = parseInt(result.rows[0].count, 10);
  
    // Formar un nuevo índice basado en el número de filas
    const producto = rowCount + 1;
  
    const query = `
      INSERT INTO Productos (id_producto, nombre, marca, modelo, descripción, material, tipo_producto, capacidad, precio, disponibilidad)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [producto, nombre, marca, modelo, descripción, material, tipo_producto, capacidad, precio, disponibilidad];
    try {
      const result = await conn.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
    }
}