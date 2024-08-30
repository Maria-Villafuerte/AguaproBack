import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'

import { getProductos, getProductById, deleteProduct, updateProduct, createProduct} from './db_products.js'
import { addEnergyValue, addConditionValue, addSizeValue, addCaracteristicas, getSize, getConditions, getEnergia,
  addTipoProducto, getTiposProducto, updateCaracteristicas, addVariables, updateVariables} from './db_characteristics.js'

import { savePurchase, deletePurchase, registerUser, loginUser, getUserById,  
  getUsers, getAllPedidos, getPedidoById, getPedidosByEstado} from './db.js'
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
      return res.status(404).json({status: 'failed', error: 'Product not found' });
    }
    return res.status(200).json({ status: 'success', message: 'Posts retrieved successfully.', data: product });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({status: 'failed',  error: 'Internal Server Error' });
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

//Endpoints para características
//Ver características
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

app.get('/tipos_producto', async (req, res) => {
  try {
    const Values = await getTiposProducto()
    if (Values !== 'No values found.') {
      res
        .status(200)
        .json({ status: 'success', message: 'Values retrieved successfully.', data: Values })
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

app.post('/tipos_producto', async (req, res) => {
  const { tipo } = req.body;

  try {
    const result = await addTipoProducto(tipo);
    res.json({ message: result });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/caracteristicas', async (req, res) => {
  const caracteristicas = req.body;

  try {
    const result = await addCaracteristicas(caracteristicas);
    res.json({ message: result });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//nuevos tamaños
app.post('/caracteristicas/variables', async (req, res) => {
  const caracteristicas_variables = req.body;

  try {
    const result = await addVariables(caracteristicas_variables);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar variables de características' });
  }
});

// Endpoint para actualizar las características "fijas" de un producto
app.put('/caracteristicas/:id_caracteristicas', async (req, res) => {
  const id_caracteristicas = req.params.id_caracteristicas;
  const caracteristicas = { ...req.body, id_caracteristicas };

  try {
    const result = await updateCaracteristicas(caracteristicas);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar características' });
  }
});

// Endpoint para actualizar las características de un producto por tamaño
app.put('/caracteristicas/variables/:id_caracteristicas', async (req, res) => {
  const { id_caracteristicas } = req.params;
  const { size, precio, disponibilidad } = req.body;
  const caracteristicas_variables = { id_caracteristicas, size, precio, disponibilidad };

  try {
    const result = await updateVariables(caracteristicas_variables);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar variables de características' });
  }
});

// Endpoint para obtener pedidos por estado
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

// Endpoint para obtener un pedido por ID
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

// Endpoint para obtener todos los pedidos
app.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await getAllPedidos();
    return res.status(200).json({ status: 'success', message: 'Se han obtenido los pedidos.', data: pedidos });;
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/pedidos/:pedidoId/productos', async (req, res) => {
  const pedidoId = parseInt(req.params.pedidoId, 10);

  try {
    const productos = await getProductosByPedido(pedidoId);
    if (productos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron productos para el pedido especificado.' });
    }
    return res.status(200).json({ status: 'success', message: 'Se han obtenido los productos para el pedido.', data: productos });;
  } catch (error) {
    console.error('Error al obtener los productos del pedido:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/register', async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    await registerUser(username, password, email, role); // role es opcional, con valor por defecto "user"
    res.status(200).json({ status: 'success', message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
});


app.post('/login', async (req, res) => {
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

app.get('/user/:id', async (req, res) => {
  const id = req.params.id
  try {
    const user = await getUserById(id)
    res.status(200).json({ status: 'success', data: user })
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message })
  }
})
app.get('/users', async (req, res) => {
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
})

app.post('/authenticate', authenticateToken, async (req, res) => {

  try {
    res.status(201).json({ status: 'success', message: 'Authenticate successfully.' })
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message })
  }
})
