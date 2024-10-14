// mailer.js
import createTransport from 'nodemailer';

async function sendEmail(to, subject, html) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'tu_correo@gmail.com',
            pass: 'tu_contraseña'
        }
    });

    let mailOptions = {
        from: 'tu_correo@gmail.com',
        to: to,
        subject: subject,
        html: html
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };
