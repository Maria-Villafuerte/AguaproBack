// mailer.test.js
import createTransport from 'nodemailer';
import sendEmail from '../../src/mailer.js';

// Simula el transportador de Nodemailer
jest.mock('nodemailer');

describe('Mailer tests', () => {
    let sendMailMock;

    beforeAll(() => {
        // Mockear el transporte y el método sendMail
        sendMailMock = jest.fn().mockResolvedValue('Correo enviado');
        createTransport.mockReturnValue({
            sendMail: sendMailMock
        });
    });

    test('Debe enviar un correo correctamente', async () => {
        const to = 'cliente@correo.com';
        const subject = 'Confirmación de compra';
        const html = '<h1>Gracias por tu compra</h1>';

        // Llamada a la función que envía el correo
        const response = await sendEmail(to, subject, html);

        // Verificar que sendMail fue llamado una vez
        expect(sendMailMock).toHaveBeenCalledTimes(1);

        // Verificar que sendMail fue llamado con los argumentos correctos
        expect(sendMailMock).toHaveBeenCalledWith({
            from: 'tu_correo@gmail.com',
            to: to,
            subject: subject,
            html: html
        });

        // Verificar que la respuesta es la esperada
        expect(response).toBe('Correo enviado');
    });
});
