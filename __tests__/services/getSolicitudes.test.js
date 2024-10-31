import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /solicitudes - Obtener todas las solicitudes', () => {
    test('Debe retornar todas las solicitudes con éxito', async () => {
      const response = await request(app).get('/solicitudes');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
});