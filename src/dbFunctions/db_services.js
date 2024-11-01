import conn from '../conn.js'

export async function getSolicitudes() {
    const result = await conn.query(`SELECT * FROM solicitud_servicio 
        ORDER BY fecha_creacion ASC`)
    return result.rows.length > 0 ? result.rows : 'No requests found.'
}

export async function getDepartamentos() {
    const result = await conn.query(`SELECT * FROM Departamentos 
        ORDER BY id_departamento ASC`)
    return result.rows.length > 0 ? result.rows : 'No requests found.'
}

export async function getServicios() {
    const result = await conn.query(`SELECT * FROM Servicios 
        ORDER BY id_tipo ASC`)
    return result.rows.length > 0 ? result.rows : 'No requests found.'
}

// Crear solicitud
export async function createRequest(solicitud) {
    const { nombre, correo, telefono, empresa, departamento, tipo_servicio, mensaje} = solicitud;

    const query = `
      INSERT INTO Solicitud_servicio (nombre, correo, telefono, empresa, departamento, tipo_servicio, mensaje)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_solicitud
    `;
    const values = [nombre, correo, telefono, empresa, departamento, tipo_servicio, mensaje];
    try {
      const result = await conn.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
    }
}

// Modificar estado de solicitud
export async function updateRequest(id_solicitud, estado) {
    const query = `
      UPDATE Solicitud_servicio SET estado = $2
      WHERE id_solicitud = $1
      RETURNING *
    `;
    const values = [id_solicitud, estado];
    try {
        const result = await conn.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        throw error;
    }
}

// Eliminar solicitud
export async function deleteRequest(id_solicitud) {
    const query = `
      DELETE FROM Solicitud_servicio WHERE id_solicitud = $1
    `;
    const values = [id_solicitud];
    try {
      const result = await conn.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
    }
}

// Crear servicio
export async function createService(nombre) {
    const query = `
      INSERT INTO Servicios (nombre)
      VALUES ($1)
      RETURNING id_tipo
    `;
    const values = [nombre];
    try {
      const result = await conn.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
    }
}

// Editar nombre servicio
export async function updateService(idServicio, nombre) {
    const query = `
      UPDATE Servicios SET nombre = $2
      WHERE id_tipo = $1
    `;
    const values = [idServicio, nombre];
    try {
      const result = await conn.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      throw error;
    }
}