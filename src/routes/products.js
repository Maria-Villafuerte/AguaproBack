import express from 'express';

// PRODUCTOS db_products
import { getProductos, getProductById, deleteProduct, updateProduct, createProduct } from '../dbFunctions/db_products.js';

const router = express.Router();

router.get('/productos', async (req, res) => {
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
  });
  
  // Obtener información de producto individual
  router.get('/productos/:productId', async (req, res) => {
    const productId = parseInt(req.params.productId, 10);
    console.log(productId)
    try {
      const product = await getProductById(productId);
      if (!product) {
        return res.status(404).json({status: 'failed', error: 'Product not found' });
      }
      return res.status(200).json({ status: 'success', message: 'Posts retrieved successfully.', data: product });
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return res.status(500).json({status: 'failed',  error: 'Internal Server Error' });
    }
  });
  
  // Ocultar un producto
  router.put('/productos/hide/:productId', async (req, res) => {
    const productId = parseInt(req.params.productId, 10);
    try {
      await deleteProduct(productId);
      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Crear un nuevo producto
  router.post('/productos', async (req, res) => {
    const newProduct = req.body;
    try {
      const createdProduct = await createProduct(newProduct);
      return res.status(201).json({
        status: 'success',
        message: 'Product created successfully.',
        data: createdProduct
      });
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({
        status: 'failed',
        error: 'Internal Server Error'
      });
    }
  });
  
  // Endpoint para actualizar un producto
  router.put('/productos/:productId', async (req, res) => {
    const productId = parseInt(req.params.productId, 10);
    const { nombre, descripción, tipo_producto } = req.body;
  
    try {
      const updated = await updateProduct(productId, nombre, descripción, tipo_producto);
      if (!updated) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default router;