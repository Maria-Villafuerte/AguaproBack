import conn from '../conn.js'
import { sendEmail } from '../routes/mail.js'; 

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

export async function getDepartamentoById(idDepartamento) {
  const result = await conn.query(`SELECT nombre FROM Departamentos 
      WHERE id_departamento = $1`, [idDepartamento])
  return result.rows.length > 0 ? result.rows[0] : 'No requests found.'
}

export async function getServicioById(idServicio) {
  const result = await conn.query(`SELECT nombre FROM Servicios 
      WHERE id_tipo = $1`, [idServicio])
  return result.rows.length > 0 ? result.rows[0] : 'No requests found.'
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

    // ENVIAR CORREO A VENTAS CON LA INFORMACIÓN
    const name_departamento = await getDepartamentoById(departamento);
    const name_servicio = await getServicioById(tipo_servicio);

    if (!name_departamento) {
        return res.status(404).json({ status: 'failed', error: 'Department not found' });
    }
    if (!name_servicio) {
        return res.status(404).json({ status: 'failed', error: 'Service not found' });
    }

    // Configura el contenido del correo
    const subject = 'Hay una nueva solicitud de servicio';
    const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h1>Hemos recibido una nueva solicitud de servicio</h1>
            <h3>Estos son los datos recibidos:</h3>
            <ul style="list-style: none; padding: 0;">
                <li><strong>Cliente:</strong> ${nombre}</li>
                <li><strong>Correo:</strong> ${correo}</li>
                <li><strong>Teléfono:</strong> ${telefono}</li>
                <li><strong>Empresa:</strong> ${empresa}</li>
                <li><strong>Departamento:</strong> ${name_departamento.nombre}</li>
                <li><strong>Servicio solicitado:</strong> ${name_servicio.nombre}</li>
                <li><strong>Mensaje:</strong><br>${mensaje}</li>
            </ul>
            <br />
        </div>
    `;
    const mailto = 'ventas4@aguatesa.com'
    try {
      const result = await conn.query(query, values);
      await sendEmail(mailto, subject, html);
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