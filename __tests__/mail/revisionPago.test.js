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
    it("debería enviar correos exitosamente cuando los datos son válidos", async () => {
        const response = await request(app)
            .post('/pedidos/revision')
            .send({
                mailTo: ['con22787@uvg.edu.gt'], 
                nombre: 'Juan Pérez',
                correo: 'juan@example.com',
                telefono: '123456789',
                idPedido: 2
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('Correos enviados');
    });

    it("debería retornar error 400 si falta algún campo", async () => {
        const response = await request(app)
            .post('/pedidos/revision')
            .send({
                nombre: 'Juan Pérez',
                correo: 'juan@example.com',
                telefono: '123456789',
                empresa: 'Empresa Prueba'
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
                idDepartamento: 1,
                idServicio: 2,
                mensaje: 'Necesito soporte técnico'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('failed');
        expect(response.body.error).toBe('Uno o más correos electrónicos son inválidos');
    });
});