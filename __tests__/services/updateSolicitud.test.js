import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('PUT /solicitud/:id - Actualizar estado de una solicitud', () => {
    test('Debe actualizar el estado de una solicitud con éxito', async () => {
      const solicitudId = 1; // ID de ejemplo
      const estadoActualizado = { estado: 'revisada' };
      const response = await request(app).put(`/solicitud/${solicitudId}`).send(estadoActualizado);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
});