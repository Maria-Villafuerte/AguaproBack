import express from 'express';
import fs from 'fs';
import multer from 'multer'; // Para manejar el archivo subido

const router = express.Router();
import nodemailer from 'nodemailer';

import { 
    getDepartamentoById, getServicioById
} from '../dbFunctions/db_services.js';

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

async function sendEmail(mailto, subject, html, attachments) {
    const mailOptions = {
        from: 'aguatesaautomatizado@gmail.com',
        to: mailto,
        subject: subject,
        html: html,
        attachments: attachments,
    };

    let attempts = 3;
    while (attempts > 0) {
        try {
            await transporter.sendMail(mailOptions);
            console.log('Correo enviado exitosamente');
            break;
        } catch (error) {
            attempts--;
            console.error(`Error al enviar el correo. Intentos restantes: ${attempts}`);
            if (attempts === 0) {
                console.log('Error definitivo al enviar correo');
            }
        }
    }
}

// PARA LOS CLIENTES
router.post('/confirmacion/pedido', async (req, res) => {
    const { mailto } = req.body;

    let subject = '¡Gracias por tu compra en Aguatesa en línea!'
    let html = `<h1>Gracias por comprar en Aguatesa.</h1>
    <p>Le daremos seguimiento a tu pedido y nos pondremos en contacto para su envío. Si tienes alguna duda o inconveniente no dudes en contactarnos.</p>
    <footer><strong>Teléfono:</strong> (502) 6670-3030 <br /><strong>Correo:</strong> ventas@aguatesa.com <br />ventas2@aguatesa.com</footer>
    <p style="font-size: 0.9em; color: #777;">Este mensaje fue generado automáticamente, por favor no responda.</p>`

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
    let html = `<h1>¡Gracias por interesarte en Aguatesa!</h1>
    <p>Tu solicitud será procesada por uno de nuestros vendedores y deberías de recibir un correo de seguimiento en breve. Si tienes alguna duda o inconveniente no dudes en contactarnos. </p>
    <footer><strong>Teléfono:</strong> (502) 6670-3030 <br /><strong>Correo:</strong> ventas@aguatesa.com <br />ventas2@aguatesa.com</footer>
    <p style="font-size: 0.9em; color: #777;">Este mensaje fue generado automáticamente, por favor no responda.</p>`

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
    <strong>Correo:</strong> ventas@aguatesa.com <br />ventas2@aguatesa.com</footer>
    <p style="font-size: 0.9em; color: #777;">Este mensaje fue generado automáticamente, por favor no responda.</p>`

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
    <footer><strong>Teléfono:</strong> (502) 6670-3030 <br /><strong>Correo:</strong> ventas@aguatesa.com <br />ventas2@aguatesa.com</footer>
    <p style="font-size: 0.9em; color: #777;">Este mensaje fue generado automáticamente, por favor no responda.</p>`

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

router.post('/password', async (req, res) => {
    const { mailto, codigo } = req.body;

    let subject = 'Cambio de contraseña. Aguatesa en línea'
    let html = ` <p>Utiliza este código para poder hacer el cambio de tu contraseña: </p>
    <h1>${codigo}</h1> </br>
    <p>Si tienes algún problema no dudes en contactarnos</p>
    <footer><strong>Teléfono:</strong> (502) 6670-3030 <br /><strong>Correo:</strong> ventas@aguatesa.com <br />ventas2@aguatesa.com</footer>
    <p style="font-size: 0.9em; color: #777;">Este mensaje fue generado automáticamente, por favor no responda.</p>`

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

// PARA LOS VENDEDORES
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

// Configuración de multer para manejar archivos subidos en memoria
const upload = multer({ storage: multer.memoryStorage() });

router.post('/pedidos/revision', upload.single('file'), async (req, res) => {
    const { mailTo, nombre, correo, telefono, idPedido, monto, banco, numAutorizacion } = req.body;
    const file = req.file; // Aquí debe estar el archivo subido

    // Verificar que los campos requeridos estén presentes
    if (!mailTo || !nombre || !correo || !telefono || !idPedido || !monto || !banco || !numAutorizacion) {
        return res.status(400).json({ status: 'failed', error: 'Todos los campos son obligatorios' });
    }

    if (!file) {
        return res.status(400).send('No image shared.');
      }

    try {
  
        // Configura el contenido del correo
        const subject = 'Se ha realizado un nuevo pedido';
        const html = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1>Nuevo pedido con opción de pago por transferencia o depósito</h1>
                <p>Se ha recibido un nuevo pedido, pero debe verificarse la validez del pago. Revisa los siguientes datos:</p>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Cliente:</strong> ${nombre}</li>
                    <li><strong>Correo:</strong> ${correo}</li>
                    <li><strong>Teléfono:</strong> ${telefono}</li>
                    <li></li>
                    <li><strong>ID del pedido:</strong> ${idPedido}</li>
                    <li><strong>Monto de cobro:</strong> ${monto}</li>
                    <li><strong>Banco destino:</strong> ${banco}</li>
                    <li><strong>Número de autorización:</strong> ${numAutorizacion}</li>
                </ul>
                <p>Se adjunta imagen como comprobante de pago</p>
            </div>
        `;
    
        // Validar que `mailTo` sea un array y que cada correo sea válido
        if (!Array.isArray(mailTo) || mailTo.some(email => !/\S+@\S+\.\S+/.test(email))) {
            return res.status(400).json({ status: 'failed', error: 'Uno o más correos electrónicos son inválidos' });
        }
  
        // Construir los adjuntos desde el buffer
        const attachment = {
            filename: `pago_pedido${idPedido}`,
            content: file.buffer, // Usar el buffer en lugar de la ruta
            contentType: file.mimetype, // Asegurarse de enviar el tipo MIME correcto
        };

        // Enviar correos a cada destinatario en el array `mailTo`
        const emailPromises = mailTo.map((recipient) => sendEmail(recipient, subject, html, [attachment]));
        await Promise.all(emailPromises);

        res.status(200).json({ status: 'success', message: 'Correos enviados' });
    } catch (error) {
        console.error('Error al enviar los correos:', error);
        res.status(500).json({ status: 'failed', error: 'Error al enviar los correos' });
    } finally {
        // Elimina el archivo temporal después de usarlo
        if (file && file.path) {
            fs.unlinkSync(file.path);
        }
    }
});

export default router;