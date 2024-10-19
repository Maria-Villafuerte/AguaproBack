import express from 'express';

// PRODUCTOS db_products
import { getProductos, getVisibleProducts,getOcultoProducts, getProductById, deleteProduct, updateProduct, updateProductDisp, createProduct } from '../dbFunctions/db_products.js';

const router = express.Router();

// Obtener todos los productos
router.get('/productos', async (req, res) => {
    try {
        const products = await getProductos();
        if (products !== 'No products found.') {
            res.status(200).json({ status: 'success', message: 'products retrieved successfully.', data: products });
        } else {
            res.status(404).json({ status: 'failed', message: 'No products found.' });
        }
    } catch (error) {
        res.status(500).json({ status: 'failed', error: error.message });
    }
});

// Obtener todos los productos visibles
router.get('/catalogo', async (req, res) => {
    try {
        const products = await getVisibleProducts();
        if (products !== 'No products found.') {
            res.status(200).json({ status: 'success', message: 'products retrieved successfully.', data: products });
        } else {
            res.status(404).json({ status: 'failed', message: 'No products found.' });
        }
    } catch (error) {
        res.status(500).json({ status: 'failed', error: error.message });
    }
});

// Obtener todos los productos ocultos
router.get('/catalogooculto', async (req, res) => {
    try {
        const products = await getOcultoProducts();
        if (products !== 'No products found.') {
            res.status(200).json({ status: 'success', message: 'products retrieved successfully.', data: products });
        } else {
            res.status(404).json({ status: 'failed', message: 'No products found.' });
        }
    } catch (error) {
        res.status(500).json({ status: 'failed', error: error.message });
    }
});

// Obtener información de producto individual
router.get('/productos/:productId', async (req, res) => {
    const productId = parseInt(req.params.productId, 10);
    try {
        const product = await getProductById(productId);
        if (!product) {
            return res.status(404).json({ status: 'failed', error: 'Product not found' });
        }
        return res.status(200).json({ status: 'success', message: 'Product retrieved successfully.', data: product });
    } catch (error) {
        return res.status(500).json({ status: 'failed', error: 'Internal Server Error' });
    }
});

// Ocultar un producto
router.put('/productos/hide/:productId', async (req, res) => {
    const productId = parseInt(req.params.productId, 10);
    try {
        await deleteProduct(productId);
        res.sendStatus(204);
    } catch (error) {
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
        return res.status(500).json({ status: 'failed', error: 'Internal Server Error' });
    }
});

// Actualizar un producto
router.put('/productos/:productId', async (req, res) => {
    const id_producto = parseInt(req.params.productId, 10);
    const {nombre, marca, modelo, descripción, 
        material, tipo_producto, capacidad, precio, disponibilidad} = req.body;
    try {
        const updated = await updateProduct(id_producto, nombre, marca, modelo, descripción, 
            material, tipo_producto, capacidad, precio, disponibilidad);
        if (!updated) {
            return res.status(404).json({status: 'failed',  error: 'Product not found' });
        }
        res.status(200).json({status: 'success', message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({status: 'failed',  error: 'Internal Server Error' });
    }
});

// Actualizar disponibilidad de un producto
router.put('/productos/disponibilidad/:productId', async (req, res) => {
    const productId = parseInt(req.params.productId, 10);
    const { disponibilidad } = req.body;
    try {
        const updated = await updateProductDisp(productId, disponibilidad);
        if (!updated) {
            return res.status(404).json({status: 'failed',  error: 'Product not found' });
        }
        res.status(200).json({status: 'success', message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({status: 'failed',  error: 'Internal Server Error' });
    }
});

export default router;
