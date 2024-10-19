import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /capacidad', () => {
    it('Debería obtener las distintas variaciones de capacidad exitosamente', async () => {
      const response = await request(app).get('/capacidad');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Values retrieved successfully.');
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true); // Verificar que data es un array
    });
  });
  