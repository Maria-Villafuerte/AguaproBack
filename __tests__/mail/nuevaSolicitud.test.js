import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe("POST /solicitud/servicio", () => {
    it("debería enviar correos exitosamente cuando los datos son válidos", async () => {
        const response = await request(app)
            .post('/solicitud/servicio')
            .send({
                mailTo: ['con22787@uvg.edu.gt'], 
                nombre: 'Juan Pérez',
                correo: 'juan@example.com',
                telefono: '123456789',
                empresa: 'Empresa Prueba',
                idDepartamento: 1,
                idServicio: 2,
                mensaje: 'Necesito soporte técnico'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('Correos enviados');
    });

    it("debería retornar error 400 si falta algún campo", async () => {
        const response = await request(app)
            .post('/solicitud/servicio')
            .send({
                nombre: 'Juan Pérez',
                correo: 'juan@example.com',
                telefono: '123456789',
                empresa: 'Empresa Prueba',
                idDepartamento: 1,
                idServicio: 2
                // Falta 'mensaje'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe('failed');
        expect(response.body.error).toBe('Todos los campos son obligatorios');
    });

    it("debería retornar error 404 si el departamento no existe", async () => {
        const response = await request(app)
            .post('/solicitud/servicio')
            .send({
                mailTo: ['con22787@uvg.edu.gt'],
                nombre: 'Juan Pérez',
                correo: 'juan@example.com',
                telefono: '123456789',
                empresa: 'Empresa Prueba',
                idDepartamento: 9999, // ID de departamento inexistente
                idServicio: 2,
                mensaje: 'Necesito soporte técnico'
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe('failed');
        expect(response.body.error).toBe('Department not found');
    });

    it("debería retornar error 400 si el correo en mailTo es inválido", async () => {
        const response = await request(app)
            .post('/solicitud/servicio')
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