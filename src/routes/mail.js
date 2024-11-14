import express from 'express';

const router = express.Router();
import nodemailer from 'nodemailer';

import { 
    getDepartamentoById, getServicioById
} from '../dbFunctions/db_services.js';
import { ids } from 'googleapis/build/src/apis/ids/index.js';

// Configura el transportador
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 465,
    secure: true,
    auth: {
        user: 'aguatesaautomatizado@gmail.com',
        pass: 'hdretlctazlmondj'
    }
});

export async function sendEmail(mailto, subject, html) {
    // Configura el contenido del correo con HTML
    let mailOptions = {
        from: 'aguatesaautomatizado@gmail.com',
        to: mailto,
        subject: subject,
        html: html
    };

    // Enviar correo de confirmación
    transporter.sendMail(mailOptions)
}

router.post('/confirmacion/pedido', async (req, res) => {
    const { mailto } = req.body;

    let subject = '¡Gracias por tu compra en Aguatesa en línea!'
    let html = '<h1>Gracias por comprar en Aguatesa.</h1><p>Le daremos seguimiento a tu pedido y nos pondremos en contacto para su envío. Si tienes alguna duda o inconveniente no dudes en contactarnos.</p><footer><strong>Teléfono:</strong> (502) 6670-3030 <br /><strong>Correo:</strong> ventas@aguatesa.com <br />ventas2@aguatesa.com</footer>'

    // Validar el correo electrónico
    if (!mailto || !/\S+@\S+\.\S+/.test(mailto)) {
        return res.status(400).send('Correo electrónico inválido');
    }

    try {
        await sendEmail(mailto, subject, html);
        res.status(200).send('Correo enviado');
    } catch (error) {
        console.error(error); // Log del error en consola
        res.status(500).send('Error al enviar el correo');
    }
});

router.post('/confirmacion/servicio', async (req, res) => {
    const { mailto } = req.body;

    let subject = '¡Recibimos tu solicitud de servicio!'
    let html = '<h1>¡Gracias por interesarte en Aguatesa!</h1><p>Tu solicitud será procesada por uno de nuestros vendedores y deberías de recibir un correo de seguimiento en breve. Si tienes alguna duda o inconveniente no dudes en contactarnos. </p><footer><strong>Teléfono:</strong> (502) 6670-3030 <br /><strong>Correo:</strong> ventas@aguatesa.com <br />ventas2@aguatesa.com</footer>'

    // Validar el correo electrónico
    if (!mailto || !/\S+@\S+\.\S+/.test(mailto)) {
        return res.status(400).send('Correo electrónico inválido');
    }

    try {
        await sendEmail(mailto, subject, html);
        res.status(200).send('Correo enviado');
    } catch (error) {
        console.error(error); // Log del error en consola
        res.status(500).send('Error al enviar el correo');
    }
});

router.post('/cancelacion', async (req, res) => {
    const { mailto, razon } = req.body;

    let subject = 'Hemos cancelado tu pedido en Aguatesa'
    let html = `<h1>Tu pedido ha sido cancelado.</h1>
    <p>Lametablemente debido a <Strong>${razon}</Strong> tu pedido fue cancelado. Si tienes alguna duda o inconveniente no dudes en contactarnos. </p>
    <footer><strong>Teléfono:</strong> (502) 6670-3030 <br />
    <strong>Correo:</strong> ventas@aguatesa.com <br />ventas2@aguatesa.com</footer>`

    // Validar el correo electrónico
    if (!mailto || !/\S+@\S+\.\S+/.test(mailto)) {
        return res.status(400).send('Correo electrónico inválido');
    }

    try {
        await sendEmail(mailto, subject, html);
        res.status(200).send('Correo enviado');
    } catch (error) {
        console.error(error); // Log del error en consola
        res.status(500).send('Error al enviar el correo');
    }
});

router.post('/pedido/pago', async (req, res) => {
    const { mailto, metodo } = req.body;

    let subject = 'Gracias por tu compra en Aguatesa en línea'
    let html = `<h1>¡Gracias por comprar en Aguatesa!</h1><p>Tendremos que confirmar que ${metodo} haya sido procesada correctamente. 
    Esto tomará un par de minutos y deberías de recibir un correo electrónico de confirmación en breve. Si tienes alguna duda o inconveniente no dudes en contactarnos. </p>
    <footer><strong>Teléfono:</strong> (502) 6670-3030 <br /><strong>Correo:</strong> ventas@aguatesa.com <br />ventas2@aguatesa.com</footer>`

    // Validar el correo electrónico
    if (!mailto || !/\S+@\S+\.\S+/.test(mailto)) {
        return res.status(400).send('Correo electrónico inválido');
    }

    try {
        await sendEmail(mailto, subject, html);
        res.status(200).send('Correo enviado');
    } catch (error) {
        console.error(error); // Log del error en consola
        res.status(500).send('Error al enviar el correo');
    }
});

router.post('/solicitud/servicio', async (req, res) => {
    const { mailTo, nombre, correo, telefono, empresa, idDepartamento, idServicio, mensaje } = req.body;

    // Verificar que los campos requeridos estén presentes
    if (!mailTo || !nombre || !correo || !telefono || !empresa || !idDepartamento || !idServicio || !mensaje) {
        return res.status(400).json({ status: 'failed', error: 'Todos los campos son obligatorios' });
    }

    try {
        const departamento = await getDepartamentoById(idDepartamento);
        const tipo_servicio = await getServicioById(idServicio);

        if (!departamento) {
            return res.status(404).json({ status: 'failed', error: 'Department not found' });
        }
        if (!tipo_servicio) {
            return res.status(404).json({ status: 'failed', error: 'Service not found' });
        }
  
        // Configura el contenido del correo
        const subject = 'Hay una nueva solicitud de servicio';
        const html = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1>Hemos recibido una nueva solicitud de servicio</h1>
                <h3>Estos son los datos recibidos:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Cliente:</strong> ${nombre}</li>
                    <li><strong>Correo:</strong> ${correo}</li>
                    <li><strong>Teléfono:</strong> ${telefono}</li>
                    <li><strong>Empresa:</strong> ${empresa}</li>
                    <li><strong>Departamento:</strong> ${departamento.nombre}</li>
                    <li><strong>Servicio solicitado:</strong> ${tipo_servicio.nombre}</li>
                    <li><strong>Mensaje:</strong><br>${mensaje}</li>
                </ul>
                <br />
                <p style="font-size: 0.9em; color: #777;">Este mensaje fue generado automáticamente, por favor no responda.</p>
            </div>
        `;
    
        // Validar que `mailTo` sea un array y que cada correo sea válido
        if (!Array.isArray(mailTo) || mailTo.some(email => !/\S+@\S+\.\S+/.test(email))) {
            return res.status(400).json({ status: 'failed', error: 'Uno o más correos electrónicos son inválidos' });
        }
  
        // Enviar correos a cada destinatario en el array `mailTo`
        const emailPromises = mailTo.map((recipient) => sendEmail(recipient, subject, html));
        await Promise.all(emailPromises);
  
        res.status(200).json({ status: 'success', message: 'Correos enviados' });
    } catch (error) {
        console.error('Error al enviar los correos:', error);
        res.status(500).json({ status: 'failed', error: 'Error al enviar los correos' });
    }
});

router.post('/pedidos/revision', async (req, res) => {
    const { mailTo, nombre, correo, telefono, idPedido } = req.body;

    // Verificar que los campos requeridos estén presentes
    if (!mailTo || !nombre || !correo || !telefono || !idPedido) {
        return res.status(400).json({ status: 'failed', error: 'Todos los campos son obligatorios' });
    }

    try {
  
        // Configura el contenido del correo
        const subject = 'Se ha realizado un nuevo pedido';
        const html = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1>Nuevo pedido con opción de pago por transferencia o depósito</h1>
                <p>Se ha recibido un nuevo pedido, pero debe verificarse la validez del pago.<br /> Estos son los datos del pedido:</p>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Cliente:</strong> ${nombre}</li>
                    <li><strong>Correo:</strong> ${correo}</li>
                    <li><strong>Teléfono:</strong> ${telefono}</li>
                    <li><strong>ID del pedido:</strong> ${idPedido}</li>
                </ul>
                <br />
                <p style="font-size: 0.9em; color: #777;">Este mensaje fue generado automáticamente, por favor no responda.</p>
            </div>
        `;
    
        // Validar que `mailTo` sea un array y que cada correo sea válido
        if (!Array.isArray(mailTo) || mailTo.some(email => !/\S+@\S+\.\S+/.test(email))) {
            return res.status(400).json({ status: 'failed', error: 'Uno o más correos electrónicos son inválidos' });
        }
  
        // Enviar correos a cada destinatario en el array `mailTo`
        const emailPromises = mailTo.map((recipient) => sendEmail(recipient, subject, html));
        await Promise.all(emailPromises);
  
        res.status(200).json({ status: 'success', message: 'Correos enviados' });
    } catch (error) {
        console.error('Error al enviar los correos:', error);
        res.status(500).json({ status: 'failed', error: 'Error al enviar los correos' });
    }
});

export default router;