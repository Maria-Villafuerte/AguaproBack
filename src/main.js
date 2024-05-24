import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import {
    getProductos,
  } from './db.js'
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

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
