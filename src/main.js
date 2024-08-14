import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import { getProductos, getProductById, deleteProduct,updateProduct, savePurchase} from './db.js'
import authenticateToken from './middleware.js'

const app = express()
  
app.use(express.json())
  
app.use(bodyParser.json())
  
app.use(cors())
  
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/productos', async (req, res) => {
  try {
    const posts = await getProductos()
    if (posts !== 'No posts found.') {
      res
        .status(200)
        .json({ status: 'success', message: 'Posts retrieved successfully.', data: posts })
    } else {
      res.status(404).json({ status: 'failed', message: 'No posts found.' })
    }
   } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message })
   }
})

// Obtener información de producto individual
app.get('/productos/:productId', async (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  console.log(productId)
  try {
    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Eliminar un producto
app.delete('/productos/:productId', async (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  try {
    await deleteProduct(productId);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint para actualizar un producto
app.put('/productos/:productId', async (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const { nombre, descripción, precio, disponibilidad, tipo_producto } = req.body;

  try {
    const updated = await updateProduct(productId, nombre, descripción, precio, disponibilidad, tipo_producto);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// save_purchase - Crear nueva compra y guardar en la base de datos
app.post('/save_purchase', async (req, res) => {
  const { clienteId, productos, nitEmpresa, idDescuento } = req.body;

  try {
    const result = await savePurchase(clienteId, productos, nitEmpresa, idDescuento);
    if (result.success) {
      return res.status(200).json({ message: 'Compra guardada exitosamente.' });
    } else {
      return res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Error al guardar la compra:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
