import express from 'express';

const router = express.Router();

// PEDIDOS db_pedidos
import { 
    savePurchase,  deletePurchase,   getAllPedidos,   getPedidoById,   getPedidosByEstado,   getProductosByPedido,  
    updatePedidoStatus,  updatePedidoDireccion,  updateProductosByPedido, searchPedidos} from '../dbFunctions/db_pedidos'

/* PEDIDOS */
// Save a new purchase
router.post('/save_purchase', async (req, res) => {
  const { clienteId, productos, nitEmpresa, idDescuento, direccion } = req.body;

  try {
    const result = await savePurchase(clienteId, productos, nitEmpresa, idDescuento, direccion);
    if (result.success) {
      return res.status(200).json({ message: 'Compra guardada exitosamente.', pedidoId: result.pedidoId });
    } else {
      return res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error al guardar la compra:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a purchase
router.delete('/delete_purchase/:pedidoId', async (req, res) => {
  const pedidoId = parseInt(req.params.pedidoId, 10);

  try {
    const result = await deletePurchase(pedidoId);
    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all pedidos
router.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await getAllPedidos();
    return res.status(200).json({ status: 'success', message: 'Se han obtenido los pedidos.', data: pedidos });
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get pedido by ID
router.get('/pedidos/:pedidoId', async (req, res) => {
  const pedidoId = parseInt(req.params.pedidoId, 10);

  try {
    const pedido = await getPedidoById(pedidoId);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    return res.status(200).json({ status: 'success', message: 'Se ha obtenido el pedido.', data: pedido });
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get pedidos by estado
router.get('/pedidos/estado/:estadoId', async (req, res) => {
  const estadoId = parseInt(req.params.estadoId, 10);

  try {
    const pedidos = await getPedidosByEstado(estadoId);
    if (pedidos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron pedidos para el estado especificado.' });
    }
    return res.status(200).json({ status: 'success', message: 'Se han obtenido los pedidos.', data: pedidos });
  } catch (error) {
    console.error('Error al obtener los pedidos por estado:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get productos by pedido
router.get('/pedidos/:pedidoId/productos', async (req, res) => {
  const pedidoId = parseInt(req.params.pedidoId, 10);

  try {
    const productos = await getProductosByPedido(pedidoId);
    if (productos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron productos para el pedido especificado.' });
    }
    return res.status(200).json({ status: 'success', message: 'Se han obtenido los productos para el pedido.', data: productos });
  } catch (error) {
    console.error('Error al obtener los productos del pedido:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update pedido status
router.put('/pedidos/:pedidoId/status', async (req, res) => {
  const pedidoId = parseInt(req.params.pedidoId, 10);
  const { estatus } = req.body;

  try {
    const result = await updatePedidoStatus(pedidoId, estatus);
    if (result.success) {
      return res.status(200).json({ message: result.message, pedidoId: result.pedidoId });
    } else {
      return res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update pedido direccion
router.put('/pedidos/:pedidoId/direccion', async (req, res) => {
  const pedidoId = parseInt(req.params.pedidoId, 10);
  const { direccion } = req.body;

  try {
    const result = await updatePedidoDireccion(pedidoId, direccion);
    if (result.success) {
      return res.status(200).json({ message: result.message, pedidoId: result.pedidoId });
    } else {
      return res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error al actualizar la dirección del pedido:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update productos by pedido
router.put('/pedidos/:pedidoId/productos', async (req, res) => {
  const pedidoId = parseInt(req.params.pedidoId, 10);
  const { productos } = req.body;

  try {
    const result = await updateProductosByPedido(pedidoId, productos);
    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error al actualizar los productos del pedido:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// searchPedidos route
router.get('/search/:searchTerm', async (req, res) => {
  const searchTerm = req.params.searchTerm;
  try {
    const pedidos = await searchPedidos(searchTerm);
    if (pedidos.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No se encontraron pedidos' });
    }
    return res.status(200).json({ status: 'success', message: 'Se han obtenido los pedidos.', data: pedidos });
  } catch (error) {
    console.error('Error al buscar pedidos:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

export default router;