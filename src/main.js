import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import { getProductos, getProductById, deleteProduct,updateProduct, savePurchase,deletePurchase} from './db.js'
import { getProductos, getProductById, deleteProduct, updateProduct, createProduct, savePurchase,
  addEnergyValue, addConditionValue, addSizeValue, addCaracteristicas, getSize, getConditions,
  getEnergia } from './db.js'
import authenticateToken from './middleware.js'

const app = express()
  
app.use(express.json())
  
app.use(bodyParser.json())
  
app.use(cors())
  
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello AguaPro!');
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

// Ocultar un producto
app.put('/productos/hide/:productId', async (req, res) => {
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
app.post('/productos', async (req, res) => {
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


// Endpoint para eliminar un pedido
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
=======
//Endpoints para características
//Ver características
app.get('/size', async (req, res) => {
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

app.get('/size', async (req, res) => {
  try {
    const sizeValues = await getSize()
    if (sizeValues !== 'No values found.') {
      res
        .status(200)
        .json({ status: 'success', message: 'Values retrieved successfully.', data: sizeValues })
    } else {
      res.status(404).json({ status: 'failed', message: 'No values found.' })
    }
   } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message })
   }
})

app.get('/condiciones', async (req, res) => {
  try {
    const conditionValues = await getConditions()
    if (conditionValues !== 'No values found.') {
      res
        .status(200)
        .json({ status: 'success', message: 'Values retrieved successfully.', data: conditionValues })
    } else {
      res.status(404).json({ status: 'failed', message: 'No values found.' })
    }
   } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message })
   }
})

app.get('/energia', async (req, res) => {
  try {
    const energyValues = await getEnergia()
    if (energyValues !== 'No values found.') {
      res
        .status(200)
        .json({ status: 'success', message: 'Values retrieved successfully.', data: energyValues })
    } else {
      res.status(404).json({ status: 'failed', message: 'No values found.' })
    }
   } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message })
   }
})

//Añadír características
app.post('/size', async (req, res) => {
  const {min_gpm, max_gpm } = req.body;

  try {
    const result = await addSizeValue(min_gpm, max_gpm);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/condiciones', async (req, res) => {
  const { Temperatura_liquida_min, Temperatura_liquida_max, Temperatura_Ambiente, presion } = req.body;

  try {
    const result = await addConditionValue(Temperatura_liquida_min, Temperatura_liquida_max, Temperatura_Ambiente, presion);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/energia', async (req, res) => {
  const { min_hp, max_hp, capacitor } = req.body;

  try {
    const result = await addEnergyValue(min_hp, max_hp, capacitor);
    res.json({ message: result });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/caracteristicas', async (req, res) => {
  const { 
    marca, size, material, profundidad, conexion_tuberia, presion_funcional, 
    head, flow_rate, aplicaciones, producto, energia, condiciones, temperatura_media 
  } = req.body;

  try {
    const result = await addCaracteristicas({ 
      marca, size, material, profundidad, conexion_tuberia, presion_funcional, 
      head, flow_rate, aplicaciones, producto, energia, condiciones, temperatura_media 
    });
    res.json({ message: result });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

