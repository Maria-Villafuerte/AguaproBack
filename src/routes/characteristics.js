import express from 'express';

const router = express.Router();

import { 
  addEnergyValue, addConditionValue, addSizeValue, addCaracteristicas, getSize, getConditions, getEnergia,
  addTipoProducto, getTiposProducto, updateCaracteristicas, addVariables, updateVariables 
} from '../dbFunctions/db_characteristics.js';

// Endpoints para características
//Ver características
router.get('/size', async (req, res) => {
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
});

router.get('/condiciones', async (req, res) => {
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
});

router.get('/energia', async (req, res) => {
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
});

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

//Añadír características
router.post('/size', async (req, res) => {
  const {min_gpm, max_gpm, range } = req.body;

  try {
    const result = await addSizeValue(min_gpm, max_gpm, range);
    res.json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/condiciones', async (req, res) => {
  const { Temperatura_liquida_min, Temperatura_liquida_max, Temperatura_Ambiente, presion } = req.body;

  try {
    const result = await addConditionValue(Temperatura_liquida_min, Temperatura_liquida_max, Temperatura_Ambiente, presion);
    res.json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/energia', async (req, res) => {
  const { min_hp, max_hp, capacitor } = req.body;

  try {
    const result = await addEnergyValue(min_hp, max_hp, capacitor);
    res.json({ status: 'success', data: result });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

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

router.post('/caracteristicas', async (req, res) => {
  const caracteristicas = req.body;

  try {
    const result = await addCaracteristicas(caracteristicas);
    res.json({ status: 'success', data: result });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

//nuevos tamaños
router.post('/caracteristicas/variables', async (req, res) => {
  const caracteristicas_variables = req.body;

  try {
    const result = await addVariables(caracteristicas_variables);
    res.json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar variables de características' });
  }
});

// Endpoint para actualizar las características "fijas" de un producto
router.put('/caracteristicas/:id_caracteristicas', async (req, res) => {
  const id_caracteristicas = req.params.id_caracteristicas;
  const caracteristicas = { ...req.body, id_caracteristicas };

  try {
    const result = await updateCaracteristicas(caracteristicas);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar características' });
  }
});

// Endpoint para actualizar las características de un producto por tamaño
router.put('/caracteristicas/variables/:id_caracteristicas', async (req, res) => {
  const { id_caracteristicas } = req.params;
  const { size, precio, disponibilidad } = req.body;
  const caracteristicas_variables = { id_caracteristicas, size, precio, disponibilidad };

  try {
    const result = await updateVariables(caracteristicas_variables);
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar variables de características' });
  }
});

export default router;