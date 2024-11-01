import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('POST /solicitud - Crear una nueva solicitud', () => {
    test('Debe crear una nueva solicitud con éxito', async () => {
      const nuevaSolicitud = { 
        nombre: 'PersonaABC',
        correo: 'ejemplo@gmail.com', 
        telefono: '11112222', 
        empresa: 'empresa fantasma 123', 
        departamento: 1, 
        tipo_servicio: 2, 
        mensaje: 'solicitud de prueba'
      };
      const response = await request(app).post('/solicitud').send(nuevaSolicitud);
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('id_solicitud');
    });
});