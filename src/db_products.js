import conn from './conn.js'

// Obtener todos los productos EN VENTA
export async function getProductos () {
    const result = await conn.query(`SELECT p.id_producto, p.nombre, p.descripción, s.range as size_range,
      v.precio, v.disponibilidad, u.nombre as tipo_producto, c.marca, c.material, c.profundidad, c.conexion_tuberia, 
      c.presion_funcional, c.head, c.flow_rate, c.aplicaciones, c.temperatura_media, s.min_gpm, 
      s.max_gpm, e.min_hp, e.max_hp, e.capacitor, t.temperatura_liquida_min, t.temperatura_liquida_max, 
      t.temperatura_ambiente, t.presion FROM Productos p
      JOIN tipo_producto u ON p.tipo_producto = u.id_tipo
      JOIN características c ON p.id_producto = c.producto
      JOIN energía e ON c.energia = e.energia
      JOIN condiciones t ON c.condiciones = t.condiciones
      JOIN caracteristicas_variables v ON v.id_caracteristicas = c.id_caracteristicas
      JOIN size s ON v.size = s.size
      WHERE estado = 'en venta'`)
    return result.rows.length > 0 ? result.rows : 'No posts found.'
}

// Obtener productos por ID
export async function getProductById(productId) {
    try {
      const result = await conn.query(`SELECT p.id_producto, p.nombre, p.descripción, s.range as size_range,
      v.precio, v.disponibilidad, u.nombre as tipo_producto, c.marca, c.material, c.profundidad, c.conexion_tuberia, 
      c.presion_funcional, c.head, c.flow_rate, c.aplicaciones, c.temperatura_media, s.min_gpm, 
      s.max_gpm, e.min_hp, e.max_hp, e.capacitor, t.temperatura_liquida_min, t.temperatura_liquida_max, 
      t.temperatura_ambiente, t.presion FROM Productos p
      JOIN tipo_producto u ON p.tipo_producto = u.id_tipo
      JOIN características c ON p.id_producto = c.producto
      JOIN energía e ON c.energia = e.energia
      JOIN condiciones t ON c.condiciones = t.condiciones
      JOIN caracteristicas_variables v ON v.id_caracteristicas = c.id_caracteristicas
      JOIN size s ON v.size = s.size
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
  
    // Obtener el número de filas en la tabla
    const result = await conn.query('SELECT COUNT(*) AS count FROM Productos');
    const rowCount = parseInt(result.rows[0].count, 10);
  
    // Formar un nuevo índice basado en el número de filas
    const producto = rowCount + 1;
  
    const query = `
      INSERT INTO Productos (id_producto, nombre, descripción, precio, disponibilidad, tipo_producto)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [producto, nombre, descripción, precio, disponibilidad, tipo_producto];
    try {
      const result = await conn.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
    }
}