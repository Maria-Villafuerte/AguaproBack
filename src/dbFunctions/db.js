import conn from '../conn.js'
import bcrypt from 'bcrypt';
import crypto from 'crypto';  // Importa el módulo crypto
import { sendEmail } from '../routes/mail.js'; 


// Account Controller
export async function registerUser(username, password, email, role = 'user') {
  try {
    // Verificar si el correo electrónico ya está registrado
    const checkEmailQuery = 'SELECT id FROM users WHERE email = $1';
    const checkEmailResult = await conn.query(checkEmailQuery, [email]);

    if (checkEmailResult.rows.length > 0) {
      throw new Error('Error al registrar el usuario: Correo electrónico ya está registrado con un usuario');
    }
    else {
      const saltRounds = 10; // Número de salt rounds para bcrypt

      if (!password || typeof password !== 'string') {
        throw new Error('Invalid password');
      }
      const hashedPassword = await bcrypt.hash(password, saltRounds); // Generar el hash de la contraseña
      const sql = 'INSERT INTO users (username, password_hash, email, role) VALUES ($1, $2, $3, $4)';  // Insertar el usuario en la base de datos
      await conn.query(sql, [username, hashedPassword, email, role]);
      return true;
    }
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
export async function generateAndSendRecoveryCode(email) {
  try {
    // Validar el correo electrónico
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error('Correo electrónico inválido');
    }

    // Buscar el usuario por su correo electrónico
    const result = await conn.query('SELECT id, email FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      throw new Error('No user found with that email.');
    }

    // Eliminar códigos antiguos para este usuario
    const deleteOldCodes = 'DELETE FROM RecoveryCodes WHERE user_id = $1';
    await conn.query(deleteOldCodes, [user.id]);

    // Generar un código de recuperación único
    const recoveryCode = crypto.randomBytes(6).toString('hex'); // Generar un código aleatorio
    const expirationTime = new Date(Date.now() + 20 * 60 * 1000); // Código válido por 20 minutos

    // Guardar el nuevo código de recuperación en la base de datos
    const sql = 'INSERT INTO RecoveryCodes (user_id, recovery_code, expiration_time) VALUES ($1, $2, $3)';
    await conn.query(sql, [user.id, recoveryCode, expirationTime]);

    // Enviar el código por correo
    let subject = 'Cambio de contraseña. Aguatesa en línea';
    let html = ` 
      <p>Utiliza este código para poder hacer el cambio de tu contraseña: </p>
      <h1>${recoveryCode}</h1> </br>
      <p>Si tienes algún problema no dudes en contactarnos</p>
      <footer><strong>Teléfono:</strong> (502) 6670-3030 <br /><strong>Correo:</strong> ventas@aguatesa.com <br />ventas2@aguatesa.com</footer>
      <p style="font-size: 0.9em; color: #777;">Este mensaje fue generado automáticamente, por favor no responda.</p>`;

    await sendEmail(user.email, subject, html);

  } catch (error) {
    console.error('Error generating and sending recovery code:', error);
    throw error;
  }
}

// Verificar el código de recuperación (sin eliminarlo)
export async function verifyRecoveryCode(email, recoveryCode) {
  try {
    // Buscar el usuario por su correo electrónico
    const result = await conn.query('SELECT id FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      throw new Error('No user found with that email.');
    }

    // Buscar el código de recuperación en la base de datos
    const sql = 'SELECT * FROM RecoveryCodes WHERE user_id = $1 AND recovery_code = $2 AND used = FALSE';
    const recoveryResult = await conn.query(sql, [user.id, recoveryCode]);

    if (recoveryResult.rows.length === 0) {
      throw new Error('Invalid or used recovery code.');
    }

    const recoveryRecord = recoveryResult.rows[0];

    // Verificar si el código ha expirado
    const currentTime = new Date();
    if (currentTime > new Date(recoveryRecord.expiration_time)) {
      throw new Error('Recovery code has expired.');
    }

    // Marcar el código como usado solo al cambiar la contraseña
    return { status: 'success', message: 'Recovery code verified.' };
  } catch (error) {
    console.error('Error verifying recovery code:', error);
    throw error;
  }
}

// Cambiar la contraseña
export async function changePassword(email, recoveryCode, newPassword) {
  try {
    // Verificar el código de recuperación
    const result = await conn.query('SELECT id FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      throw new Error('No user found with that email.');
    }

    const sql = 'SELECT * FROM RecoveryCodes WHERE user_id = $1 AND recovery_code = $2 AND used = FALSE';
    const recoveryResult = await conn.query(sql, [user.id, recoveryCode]);

    if (recoveryResult.rows.length === 0) {
      throw new Error('Invalid or used recovery code.');
    }

    const recoveryRecord = recoveryResult.rows[0];

    // Verificar si el código ha expirado
    const currentTime = new Date();
    if (currentTime > new Date(recoveryRecord.expiration_time)) {
      throw new Error('Recovery code has expired.');
    }

    // Encriptar la nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar la contraseña en la base de datos
    const updatePasswordSql = 'UPDATE users SET password_hash = $1 WHERE id = $2';
    await conn.query(updatePasswordSql, [hashedPassword, user.id]);

    // Marcar el código como usado
    const updateRecoveryCodeSql = 'UPDATE RecoveryCodes SET used = TRUE WHERE user_id = $1 AND recovery_code = $2';
    await conn.query(updateRecoveryCodeSql, [user.id, recoveryCode]);

    return { status: 'success', message: 'Password changed successfully.' };
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}