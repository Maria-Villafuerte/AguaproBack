import express from 'express';
import { getSolicitudes, getDepartamentos, getServicios, createRequest, updateRequest, deleteRequest,
    createService, updateService } from '../dbFunctions/db_services.js';
import { authenticateToken, authorizeRole } from '../middleware.js';

const router = express.Router();

// Obtener todas las solicitudes de servicio
router.get('/solicitudes',authenticateToken, authorizeRole('solicitudes'), async (req, res) => {
    try {
        const solicitudes = await getSolicitudes();
        res.status(200).json({ status: 'success', message: 'Se han obtenido las solicitudes.', data: solicitudes});
    } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
        res.status(500).json({ status: 'failed', message: 'Error al obtener las solicitudes.' });
    }
});

// Obtener todos los departamentos
router.get('/departamentos', async (req, res) => {
    try {
        const departamentos = await getDepartamentos();
        res.status(200).json({ status: 'success', message: 'Se han obtenido los departamentos.', data: departamentos});
    } catch (error) {
        console.error('Error al obtener los departamentos:', error);
        res.status(500).json({status: 'failed', message: 'Error al obtener los departamentos.' });
    }
});

// Obtener todos los servicios
router.get('/servicios', async (req, res) => {
    try {
        const servicios = await getServicios();
        res.status(200).json({ status: 'success', message: 'Se han obtenido los tipos de servicio.', data: servicios});
    } catch (error) {
        console.error('Error al obtener los servicios:', error);
        res.status(500).json({status: 'failed', message: 'Error al obtener los servicios.' });
    }
});

// Crear una nueva solicitud de servicio
router.post('/solicitud', async (req, res) => {
    const solicitud = req.body;
    try {
        const nuevaSolicitud = await createRequest(solicitud);
        res.status(201).json({ status: 'success', message: 'Se ha guardado la solicitud.', data: nuevaSolicitud});
    } catch (error) {
        console.error('Error al crear la solicitud:', error);
        res.status(500).json({status: 'failed', message: 'Error al crear la solicitud.' });
    }
});

// Actualizar estado de una solicitud
router.put('/solicitud/:id',authenticateToken, authorizeRole('solicitudes'), async (req, res) => {
    const id_solicitud = req.params.id;
    const { estado } = req.body;

    try {
        const solicitudActualizada = await updateRequest(id_solicitud, estado);
        res.status(200).json({ status: 'success', message: 'Se han actualizado el estado de la solicitud.', data: solicitudActualizada});
    } catch (error) {
        console.error('Error al actualizar la solicitud:', error);
        res.status(500).json({status: 'failed', message: 'Error al actualizar la solicitud.' });
    }
});

// Eliminar solicitud
router.delete('/solicitud/:id',authenticateToken, authorizeRole('solicitudes'), async (req, res) => {
    const id_solicitud = req.params.id;

    try {
        const solicitudEliminada = await deleteRequest(id_solicitud);
        res.status(200).json({ status: 'success', message: 'Solicitud eliminada con éxito.', data: solicitudEliminada});
    } catch (error) {
        console.error('Error al eliminar la solicitud:', error);
        res.status(500).json({status: 'failed', message: 'Error al eliminar la solicitud.' });
    }
});

// Crear un nuevo servicio
router.post('/servicio',authenticateToken, authorizeRole('solicitudes'), async (req, res) => {
    const { nombre } = req.body;
    try {
        const nuevoServicio = await createService(nombre);
        res.status(201).json({ status: 'success', message: 'Se ha guardado el servicio.', data: nuevoServicio});
    } catch (error) {
        console.error('Error al crear el servicio:', error);
        res.status(500).json({status: 'failed', message: 'Error al crear el servicio.' });
    }
});

// Actualizar nombre de un servicio
router.put('/servicio/:id',authenticateToken, authorizeRole('solicitudes'), async (req, res) => {
    const idServicio = req.params.id;
    const { nombre } = req.body;
    try {
        const servicioActualizado = await updateService(idServicio, nombre);
        res.status(200).json({ status: 'success', message: 'Se han actualizado el servicio.', data: servicioActualizado});
    } catch (error) {
        console.error('Error al actualizar el servicio:', error);
        res.status(500).json({status: 'failed', message: 'Error al actualizar el servicio.' });
    }
});

export default router;
