import express from 'express';

const router = express.Router();
import nodemailer from 'nodemailer';


// Configura el transportador
let transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user: 'aguatesaautomatizado@gmail.com',
        pass: 'Auto_correos1410'
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

router.post('/confirmacion', async (req, res) => {
    const { mailto, subject, html } = req.body;

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