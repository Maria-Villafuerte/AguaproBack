import conn from '../conn.js'

// Obtener todos los productos
export async function getProductos () {
    const result = await conn.query(`SELECT 
      p.id_producto, p.nombre, p.descripción,
      u.nombre AS tipoProducto,
      p.marca, p.modelo, p.material,
      p.cap_min AS capacidadMin, p.cap_max AS capacidadMax,
      p.precio, p.disponibilidad, p.estado
      FROM Productos p
      JOIN tipo_producto u ON p.tipo_producto = u.id_tipo`)
    return result.rows.length > 0 ? result.rows : 'No posts found.'
}

// Obtener todos los productos EN VENTA
export async function getVisibleProducts() {
  const result = await conn.query(`SELECT 
      p.id_producto, p.nombre, p.descripción,
      u.nombre AS tipoProducto,
      p.marca, p.modelo, p.material,
      p.cap_min AS capacidadMin, p.cap_max AS capacidadMax,
      p.precio, p.disponibilidad, p.estado
      FROM Productos p
      JOIN tipo_producto u ON p.tipo_producto = u.id_tipo
      WHERE p.estado = 'en venta'`)
  return result.rows.length > 0 ? result.rows : 'No posts found.'
}

// Obtener todos los productos OCULTO
export async function getOcultoProducts() {
  const result = await conn.query(`SELECT 
      p.id_producto, p.nombre, p.descripción,
      u.nombre AS tipoProducto,
      p.marca, p.modelo, p.material,
      p.cap_min AS capacidadMin, p.cap_max AS capacidadMax,
      p.precio, p.disponibilidad, p.estado
      FROM Productos p
      JOIN tipo_producto u ON p.tipo_producto = u.id_tipo
    WHERE p.estado = 'oculto'`)
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

export async function unhideProduct(productId) {
  try {
      await conn.query("UPDATE Productos SET estado = 'en venta' WHERE id_producto = $1", [productId]);
  } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
  }
}

// Editar producto
export async function updateProduct(id_producto, nombre, marca, modelo, descripción, 
    material, tipo_producto, capacidad_min, capacidad_max, precio, disponibilidad) {
    try {
      const query = `
      UPDATE Productos 
      SET 
        nombre = $1, marca = $2, modelo = $3, descripción = $4, material = $5, tipo_producto = $6, 
        cap_min = $7, cap_max = $8, precio = $9, disponibilidad = $10 WHERE id_producto = $11`;
    
      const values = [ nombre, marca, modelo, descripción, material, tipo_producto, capacidad_min, capacidad_max, precio, disponibilidad, id_producto];
    
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
    const { nombre, marca, modelo, descripción, material, tipo_producto, 
      capacidad_min, capacidad_max, precio, disponibilidad
     } = product;
  
    const query = `
      INSERT INTO Productos (nombre, marca, modelo, descripción, material, tipo_producto, cap_min, cap_max, precio, disponibilidad)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [nombre, marca, modelo, descripción, material, tipo_producto, capacidad_min, capacidad_max, precio, disponibilidad];
    try {
      const result = await conn.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
    }
}