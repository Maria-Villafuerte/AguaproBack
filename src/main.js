import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// CLIENTES db_cliente
import { saveCliente, getAllClientes, getOneCliente, editOneCliente, deleteOneCliente } from './dbFunctions/db_cliente.js';
// PEDIDOS db_pedidos
import { 
  savePurchase,  deletePurchase,   getAllPedidos,   getPedidoById,   getPedidosByEstado,   getProductosByPedido,  
  updatePedidoStatus,  updatePedidoDireccion,  updateProductosByPedido, searchPedidos} from './dbFunctions/db_pedidos.js'

const app = express()
  
app.use(express.json())
  
app.use(bodyParser.json())
  
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello AguaPro!');
});

// Usar las rutas de características
import charsRoutes from './routes/characteristics.js';
app.use('', charsRoutes);

// Usar las rutas de productos
import productsRoutes from './routes/products.js';
app.use('', productsRoutes);

// Usar las rutas de users
import userRoutes from './routes/users.js';
app.use('', userRoutes);

// Client endpoints
app.post('/clientes', async (req, res) => {
  const { nombre, direccion, telefono, nit } = req.body;
  try {
    const newCliente = await saveCliente(nombre, direccion, telefono, nit);
    res.status(201).json({ status: 'success', message: 'Cliente creado exitosamente', data: newCliente });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ status: 'failed', error: 'Error interno del servidor' });
  }
});

app.get('/clientes', async (req, res) => {
  try {
    const clientes = await getAllClientes();
    res.status(200).json({ status: 'success', message: 'Clientes obtenidos exitosamente', data: clientes });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ status: 'failed', error: 'Error interno del servidor' });
  }
});

app.get('/clientes/:id', async (req, res) => {
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

app.put('/clientes/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nombre, direccion, telefono, nit } = req.body;
  try {
    const updatedCliente = await editOneCliente(id, nombre, direccion, telefono, nit);
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
app.delete('/clientes/:id', async (req, res) => {
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

/* PEDIDOS */
// Save a new purchase
app.post('/save_purchase', async (req, res) => {
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
app.delete('/delete_purchase/:pedidoId', async (req, res) => {
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
app.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await getAllPedidos();
    return res.status(200).json({ status: 'success', message: 'Se han obtenido los pedidos.', data: pedidos });
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get pedido by ID
app.get('/pedidos/:pedidoId', async (req, res) => {
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
app.get('/pedidos/estado/:estadoId', async (req, res) => {
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
app.get('/pedidos/:pedidoId/productos', async (req, res) => {
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
app.put('/pedidos/:pedidoId/status', async (req, res) => {
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
app.put('/pedidos/:pedidoId/direccion', async (req, res) => {
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
app.put('/pedidos/:pedidoId/productos', async (req, res) => {
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
app.get('/search/:searchTerm', async (req, res) => {
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

// Exportamos app para poder usarla en los tests
export default app;

// Solo iniciamos el servidor si este archivo es ejecutado directamente
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
  });
}
