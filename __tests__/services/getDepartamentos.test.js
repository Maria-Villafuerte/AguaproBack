import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /departamentos - Obtener todos los departamentos', () => {
    test('Debe retornar todos los departamentos con éxito', async () => {
      const response = await request(app).get('/departamentos');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
});