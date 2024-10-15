import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /tipos_producto', () => {
    it('Debería obtener los tipos de producto exitosamente', async () => {
      const response = await request(app).get('/tipos_producto');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Values retrieved successfully.');
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true); // Verificar que data es un array
    });
  });
  