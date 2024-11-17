import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

import { registerUser, loginUser, getUserById, getUsers, deleteUser, updateUser, updateUserRole, generateAndSendRecoveryCode,verifyRecoveryCode,changePassword} from '../dbFunctions/db.js'
import {authenticateToken, authorizeRole} from '../middleware.js'

router.post('/register', async (req, res) => {
    const { username, password, email, role } = req.body;
  
    try {
      await registerUser(username, password, email, role); // role es opcional, con valor por defecto "user"
      res.status(200).json({ status: 'success', message: 'User registered successfully.' });
    } catch (error) {
      res.status(500).json({ status: 'failed', error: error.message });
    }
});
  
  
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await loginUser(username, password);
      if (user) {
        const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, {
          expiresIn: '24h'
        });
        res.status(200).json({
          status: 'success',
          message: 'User logged in successfully',
          username: user.username,
          token,
          role: user.role,
          id: user.id
        });
      } else {
        res.status(401).json({ status: 'failed', message: 'Invalid username or password.' });
      }
    } catch (error) {
      res.status(500).json({ status: 'failed', error: error.message });
    }
});
  
router.get('/user/:id', async (req, res) => {
    const id = req.params.id
    try {
      const user = await getUserById(id)
      res.status(200).json({ status: 'success', data: user })
    } catch (error) {
      res.status(500).json({ status: 'failed', error: error.message })
    }
  })
router.get('/users',authenticateToken, authorizeRole('usuarios'), async (req, res) => {
    try {
      const users = await getUsers()
      if (users !== 'No Users found.') {
        res
          .status(200)
          .json({ status: 'success', message: 'Users retrieved successfully.', data: users })
      } else {
        res.status(404).json({ status: 'failed', message: 'No users found.' })
      }
     } catch (error) {
      res.status(500).json({ status: 'failed', error: error.message })
     }
});
  
router.post('/authenticate', authenticateToken, async (req, res) => {
  
    try {
      res.status(201).json({ status: 'success', message: 'Authenticate successfully.' })
    } catch (error) {
      res.status(500).json({ status: 'failed', error: error.message })
    }
});

// Eliminar usuario
router.delete('/user/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    const result = await deleteUser(id);
    if (result) {
      res.status(200).json({ status: 'success', message: 'User deleted successfully.' });
    } else {
      res.status(404).json({ status: 'failed', message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

// Actualizar usuario (username y email)
router.put('/user/:id', async (req, res) => {
  const id = req.params.id;
  const { username, email } = req.body;
  
  try {
    const result = await updateUser(id, username, email);
    if (result) {
      res.status(200).json({ status: 'success', message: 'User updated successfully.' });
    } else {
      res.status(404).json({ status: 'failed', message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

// Cambiar rol de usuario
router.put('/user/:id/role',authenticateToken, authorizeRole('usuarios'), async (req, res) => {
  const id = req.params.id;
  const { role } = req.body;
  
  try {
    const result = await updateUserRole(id, role);
    if (result) {
      res.status(200).json({ status: 'success', message: 'User role updated successfully.' });
    } else {
      res.status(404).json({ status: 'failed', message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

// Verificar de usuario y correo
router.get('/verify/:username/:mail', async (req, res) => {
  const { username, mail } = req.params;
  
  if (!username || !mail) {
    return res.status(400).json({ status: 'failed', message: 'Usuario y correo requeridos.' });
  }  

  try {
    const result = await checkUser(username, mail);
    if (result) {
      const userId = result.id;
      res.status(200).json({ status: 'success', message: 'Valid user', data: userId });
    } else {
      res.status(404).json({ status: 'failed', message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

// Verificar de usuario y correo
router.get('/verify/:username/:mail', async (req, res) => {
  const { username, mail } = req.params;
  
  if (!username || !mail) {
    return res.status(400).json({ status: 'failed', message: 'Usuario y correo requeridos.' });
  }  

  try {
    const result = await checkUser(username, mail);
    if (result) {
      const userId = result.id;
      res.status(200).json({ status: 'success', message: 'Valid user', data: userId });
    } else {
      res.status(404).json({ status: 'failed', message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

// Endpoint para generar el código de recuperación
router.post('/passwordrecovery', async (req, res) => {
  const { email } = req.body;

  try {
    // Validar el correo electrónico
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ status: 'failed', error: 'Correo electrónico inválido' });
    }

    // Llamar a la función para generar el código y enviarlo por correo
    await generateAndSendRecoveryCode(email);
    res.status(200).json({
      status: 'success',
      message: 'Recovery code sent to email.'
    });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});

// Endpoint para verificar el código de recuperación
router.post('/verifyrecoverycode', async (req, res) => {
  const { email, recoveryCode } = req.body;

  try {
    const response = await verifyRecoveryCode(email, recoveryCode);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ status: 'failed', error: error.message });
  }
});

// Endpoint para cambiar la contraseña
router.post('/changepassword', async (req, res) => {
  const { email, recoveryCode, newPassword } = req.body;

  try {
    const response = await changePassword(email, recoveryCode, newPassword);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ status: 'failed', error: error.message });
  }
});
export default router;