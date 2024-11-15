import express from 'express';

const router = express.Router();
import { authenticateToken, authorizeRole } from '../middleware.js';

import { getSales, getTotalSales, getTopProducts, getTopClients, getDailySales } from '../dbFunctions/db_statistics.js';

// Get all sales
router.get('/sales',authenticateToken, authorizeRole('analitica'), async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    try {
        const ventas = await getSales(fechaInicio, fechaFin);
        return res.status(200).json({ status: 'success', message: 'Se han obtenido las ventas.', data: ventas });
    } catch (error) {
        console.error('Error al obtener las facturas de ventas:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/sales/sum',authenticateToken, authorizeRole('analitica'), async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    try {
        const ventas = await getTotalSales(fechaInicio, fechaFin);
        return res.status(200).json({ status: 'success', message: 'Se han obtenido las ventas.', data: ventas });
    } catch (error) {
        console.error('Error al obtener las facturas de ventas:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/sales/products',authenticateToken, authorizeRole('analitica'), async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    try {
        const productos = await getTopProducts(fechaInicio, fechaFin);
        return res.status(200).json({ status: 'success', message: 'Se han obtenido los productos', data: productos });
    } catch (error) {
        console.error('Error al obtener los productos de esas fechas:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/sales/clients',authenticateToken, authorizeRole('analitica'), async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    try {
        const clientes = await getTopClients(fechaInicio, fechaFin);
        return res.status(200).json({ status: 'success', message: 'Se han obtenido los clientes', data: clientes });
    } catch (error) {
        console.error('Error al obtener los clientes de esas fechas:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/sales/daily',authenticateToken, authorizeRole('analitica'), async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    try {
        const ventas = await getDailySales(fechaInicio, fechaFin);
        return res.status(200).json({ status: 'success', message: 'Se han obtenido las ventas', data: ventas });
    } catch (error) {
        console.error('Error al obtener las ventas de esas fechas:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;