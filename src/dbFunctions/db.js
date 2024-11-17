import conn from '../conn.js'
import bcrypt from 'bcrypt';


// Account Controller
export async function registerUser(username, password, email, role = 'user') {
  try {
    const saltRounds = 10; // Número de salt rounds para bcrypt

    console.log('Password received:', password); // Imprime la contraseña para depurar

    if (!password || typeof password !== 'string') {
      throw new Error('Invalid password');
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Generar el hash de la contraseña
    const sql = 'INSERT INTO users (username, password_hash, email, role) VALUES ($1, $2, $3, $4)';  // Insertar el usuario en la base de datos
    await conn.query(sql, [username, hashedPassword, email, role]);

    return true;
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    throw error;
  }
}

export async function loginUser(username, password) {
  const sql = 'SELECT id, username, password_hash, email, role FROM users WHERE username = $1';
  const result = await conn.query(sql, [username]);

  if (result.rows.length > 0) {
    const user = result.rows[0];

    // Compara la contraseña ingresada con el hash almacenado
    const match = await bcrypt.compare(password, user.password_hash);

    if (match) {
      // Si la contraseña coincide, devuelve los datos del usuario
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };
    } else {
      return null; // Contraseña incorrecta
    }
  } else {
    return null; // Usuario no encontrado
  }
}

export async function getUserById (id) {
  const sql = 'SELECT * FROM users WHERE id = $1'
  const result = await conn.query(sql, [id])
  return result.rows[0].length > 0 ? 'No user found.' : result.rows
}
export async function getUsers () {
  const sql = 'SELECT * FROM users'
  const result = await conn.query(sql)
  return result.rows.length > 0 ? result.rows : 'No users found.'
}

// Eliminar usuario
export async function deleteUser(id) {
  try {
    const sql = 'DELETE FROM users WHERE id = $1';
    await conn.query(sql, [id]);
    return true;
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    throw error;
  }
}

// Actualizar usuario (username, email)
export async function updateUser(id, username, email) {
  try {
    const sql = 'UPDATE users SET username = $1, email = $2 WHERE id = $3';
    await conn.query(sql, [username, email, id]);
    return true;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
}

// Cambiar rol de usuario
export async function updateUserRole(id, role) {
  try {
    const sql = 'UPDATE users SET role = $1 WHERE id = $2';
    await conn.query(sql, [role, id]);
    return true;
  } catch (error) {
    console.error('Error al cambiar el rol del usuario:', error);
    throw error;
  }
}

// Buscar usuario segun nombre y correo
export async function checkUser(username, mail) {
  try {
    const sql = 'SELECT id FROM users WHERE username = $1 AND email = $2';
    const result = await conn.query(sql, [username, mail]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error('Error al verificar usuario:', error);
    throw error;
  }
}