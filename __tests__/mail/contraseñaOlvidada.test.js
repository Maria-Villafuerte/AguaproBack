import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('Mailer API tests for new password', () => {
    it('should send an email with the code provided', async () => {
        const response = await request(app)
            .post('/contraseña/olvidada')
            .send({ mailto: 'con22787@uvg.edu.gt', codigo: '5578'}); 

        expect(response.status).toBe(200);
        expect(response.text).toBe('Correo enviado');
    });

    it('should return 400 for invalid email', async () => {
        const response = await request(app)
            .post('/contraseña/olvidada')
            .send({ mailto: 'invalid-email', codigo: '5578' });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Correo electrónico inválido');
    });
});