import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

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

// Usar las rutas de clientes
import clientRoutes from './routes/clients.js';
app.use('', clientRoutes);

// Usar las rutas de users
import pedidosRoutes from './routes/pedidos.js';
app.use('', pedidosRoutes);

// Exportamos app para poder usarla en los tests
export default app;

// Solo iniciamos el servidor si este archivo es ejecutado directamente
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
  });
}
