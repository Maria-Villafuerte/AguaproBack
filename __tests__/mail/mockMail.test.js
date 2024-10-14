import { sendEmail } from '../../src/routes/mail.js';
import nodemailer from 'nodemailer';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

// Mock de nodemailer
jest.mock('nodemailer', () => ({
    createTransport: jest.fn()
}));

describe('Mailer tests', () => {
    let sendMailMock;

    beforeAll(() => {
        sendMailMock = jest.fn().mockResolvedValue('Correo enviado');

        nodemailer.createTransport.mockReturnValue({
            sendMail: sendMailMock
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Debe enviar un correo correctamente', async () => {
        const to = 'cliente@correo.com';
        const subject = 'Confirmación de compra';
        const html = '<h1>Gracias por tu compra</h1>';

        const response = await sendEmail(to, subject, html);

        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith({
            from: 'aguatesaautomatizado@gmail.com',
            to: to,
            subject: subject,
            html: html
        });

        expect(response).toBe('Correo enviado');
    });
});