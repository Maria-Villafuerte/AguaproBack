import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('Mailer API test for service', () => {
    it('should send an email confirmation', async () => {
        const response = await request(app)
            .post('/confirmacion/servicio')
            .send({ mailto: 'con22787@uvg.edu.gt'}); 

        expect(response.status).toBe(200);
        expect(response.text).toBe('Correo enviado');
    });

    it('should return 400 for invalid email', async () => {
        const response = await request(app)
            .post('/confirmacion/servicio')
            .send({ mailto: 'invalid-email' });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Correo electrónico inválido');
    });
});