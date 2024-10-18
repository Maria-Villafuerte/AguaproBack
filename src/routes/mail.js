import express from 'express';

const router = express.Router();
import nodemailer from 'nodemailer';


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

    let subject = 'Gracias por tu compra en Aguatesa en línea'
    let html = '<h1>¡Gracias por comprar en Aguatesa!</h1> <p>Le daremos seguimiento a tu pedido y lo puedes esperar de X a X días hábiles. Si tienes alguna duda o inconveniente no dudes en contactarnos.</p> <footer> <Strong>Teléfono:</Strong> (502) 6670-3030 / 6631-1845 <Strong>Correo:</Strong> ventas@aguatesa.com ventas2@aguatesa.com </footer>'

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

    let subject = 'Recibimos tu solicitud de servicio'
    let html = '<h1>Gracias por conectar con nosotros, pronto te estaremos contactando</h1>'

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
    const { mailto } = req.body;

    let subject = 'Hemos cancelado tu pedido en Aguatesa'
    let html = '<h1>Por estas razones tu pedido fue cancelado, comunicate con nosotros</h1>'

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
    const { mailto } = req.body;

    let subject = 'Gracias por tu compra en Aguatesa en línea'
    let html = '<h1>Hemos recibido tu pedido, te enviamos los datos para que puedas realiar tu pago</h1>'

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

export default router;