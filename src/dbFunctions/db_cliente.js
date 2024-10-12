import conn from '../conn.js'

export async function saveCliente(nombre, direccion, telefono, nit, user_reference) {
  try {
    // Start a transaction
    await conn.query('BEGIN');

    // Get the maximum id_cliente
    const maxIdResult = await conn.query('SELECT MAX(id_cliente) FROM Clientes');
    const maxId = maxIdResult.rows[0].max || 0;

    // Increment the id
    const newId = maxId + 1;

    // Insert the new client with the new id
    const sql = 'INSERT INTO Clientes (id_cliente, nombre, direccion, telefono, nit, user_reference) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [newId, nombre, direccion, telefono, nit, user_reference];
    const result = await conn.query(sql, values);

    // Commit the transaction
    await conn.query('COMMIT');

    return result.rows[0];
  } catch (error) {
    // If there's an error, roll back the transaction
    await conn.query('ROLLBACK');
    throw error;
  }
}

export async function getAllClientes() {
  const sql = 'SELECT * FROM Clientes';
  const result = await conn.query(sql);
  return result.rows;
}

export async function getOneCliente(id) {
  const sql = 'SELECT * FROM Clientes WHERE id_cliente = $1';
  const result = await conn.query(sql, [id]);
  return result.rows[0];
}

export async function getOneClienteByUser(user_reference) {
  const sql = 'SELECT * FROM Clientes WHERE user_reference = $1';
  const result = await conn.query(sql, [user_reference]);
  return result.rows[0];
}

export async function editOneCliente(id, nombre, direccion, telefono, nit, user_reference) {
  const sql = 'UPDATE Clientes SET nombre = $2, direccion = $3, telefono = $4, nit = $5, user_reference = $6 WHERE id_cliente = $1 RETURNING *';
  const values = [id, nombre, direccion, telefono, nit, user_reference];
  const result = await conn.query(sql, values);
  return result.rows[0];
}

export async function deleteOneCliente(id) {
  const sql = 'DELETE FROM Clientes WHERE id_cliente = $1 RETURNING *';
  const result = await conn.query(sql, [id]);
  return result.rows[0];
}

export async function editUserCliente(id, user_reference) {
  const sql = 'UPDATE Clientes SET user_reference = $2 WHERE id_cliente = $1 RETURNING *';
  const values = [id, user_reference];
  const result = await conn.query(sql, values);
  return result.rows[0];
}