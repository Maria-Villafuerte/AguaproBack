import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe("POST /pedidos/revision", () => {
    it("debería retornar error 400 si falta algún campo", async () => {
        const response = await request(app)
            .post('/pedidos/revision')
            .send({
                nombre: 'Juan Pérez',
                correo: 'juan@example.com',
                telefono: '123456789',
                empresa: 'Empresa Prueba',
                monto: 450.5,
                banco: 'G&T',
                numAutorizacion: '1620-23'
                //falta idPedido
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('failed');
        expect(response.body.error).toBe('Todos los campos son obligatorios');
    });

    it("debería retornar error 400 si el correo en mailTo es inválido", async () => {
        const response = await request(app)
            .post('/pedidos/revision')
            .send({
                mailTo: ['invalid-email'], // Correo inválido
                nombre: 'Juan Pérez',
                correo: 'juan@example.com',
                telefono: '123456789',
                empresa: 'Empresa Prueba',
                idPedido: 1,
                monto: 450.5,
                banco: 'G&T',
                numAutorizacion: '1620-23'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('failed');
        expect(response.body.error).toBe('Uno o más correos electrónicos son inválidos');
    });
});