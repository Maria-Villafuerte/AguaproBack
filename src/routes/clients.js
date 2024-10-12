import express from 'express';

const router = express.Router();

import { saveCliente, getAllClientes, getOneCliente, getOneClienteByUser,
   editOneCliente, deleteOneCliente, editUserCliente } from '../dbFunctions/db_cliente.js';

// Client endpoints
router.post('/clientes', async (req, res) => {
    const { nombre, direccion, telefono, nit } = req.body;
    try {
      const newCliente = await saveCliente(nombre, direccion, telefono, nit);
      res.status(201).json({ status: 'success', message: 'Cliente creado exitosamente', data: newCliente });
    } catch (error) {
      console.error('Error al crear cliente:', error);
      res.status(500).json({ status: 'failed', error: 'Error interno del servidor' });
    }
  });
  
  router.get('/clientes', async (req, res) => {
    try {
      const clientes = await getAllClientes();
      res.status(200).json({ status: 'success', message: 'Clientes obtenidos exitosamente', data: clientes });
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      res.status(500).json({ status: 'failed', error: 'Error interno del servidor' });
    }
  });
  
  router.get('/clientes/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
      const cliente = await getOneCliente(id);
      if (cliente) {
        res.status(200).json({ status: 'success', message: 'Cliente obtenido exitosamente', data: cliente });
      } else {
        res.status(404).json({ status: 'failed', message: 'Cliente no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      res.status(500).json({ status: 'failed', error: 'Error interno del servidor' });
    }
  });

  router.get('/clientes/user/:user_reference', async (req, res) => {
    const user_reference = parseInt(req.params.user_reference, 10);
    try {
      const cliente = await getOneClienteByUser(user_reference);
      if (cliente) {
        res.status(200).json({ status: 'success', message: 'Cliente obtenido exitosamente', data: cliente });
      } else {
        res.status(404).json({ status: 'failed', message: 'Cliente no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      res.status(500).json({ status: 'failed', error: 'Error interno del servidor' });
    }
  });
  
  router.put('/clientes/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { nombre, direccion, telefono, nit, user_reference } = req.body;
    try {
      const updatedCliente = await editOneCliente(id, nombre, direccion, telefono, nit, user_reference);
      if (updatedCliente) {
        res.status(200).json({ status: 'success', message: 'Cliente actualizado exitosamente', data: updatedCliente });
      } else {
        res.status(404).json({ status: 'failed', message: 'Cliente no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      res.status(500).json({ status: 'failed', error: 'Error interno del servidor' });
    }
  });
  
  // New delete endpoint
  router.delete('/clientes/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
      const deletedCliente = await deleteOneCliente(id);
      if (deletedCliente) {
        res.status(200).json({ status: 'success', message: 'Cliente eliminado exitosamente', data: deletedCliente });
      } else {
        res.status(404).json({ status: 'failed', message: 'Cliente no encontrado' });
      }
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      res.status(500).json({ status: 'failed', error: 'Error interno del servidor' });
    }
  });

  router.put('/clientes/user/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { user_reference } = req.body;
    try {
      const updatedCliente = await editUserCliente(user_reference);
      if (updatedCliente) {
        res.status(200).json({ status: 'success', message: 'Cliente actualizado exitosamente', data: updatedCliente });
      } else {
        res.status(404).json({ status: 'failed', message: 'Cliente no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      res.status(500).json({ status: 'failed', error: 'Error interno del servidor' });
    }
  });
  
export default router;