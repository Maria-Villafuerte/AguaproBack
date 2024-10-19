import express from 'express';

const router = express.Router();

import { 
  addTipoProducto, getTiposProducto, addCapacidad, getCapacidad
} from '../dbFunctions/db_characteristics.js';

// Endpoints para características
//Ver características
router.get('/tipos_producto', async (req, res) => {
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

router.get('/capacidad', async (req, res) => {
  try {
    const Values = await getCapacidad()
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
router.post('/tipos_producto', async (req, res) => {
  const { tipo } = req.body;

  try {
    const result = await addTipoProducto(tipo);
    res.json({ status: 'success', data: result });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/capacidad', async (req, res) => {
  const { cap_min, cap_max } = req.body;

  try {
    const result = await addCapacidad(cap_min, cap_max);
    res.json({ status: 'success', data: result });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;