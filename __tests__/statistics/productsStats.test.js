import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

// Prueba para GET /sales/products
  describe('GET /sales/products', () => {
    it('should retrieve top products successfully for given dates', async () => {
      const response = await request(app).get('/sales/products')
        .query({ fechaInicio: '2024-09-26', fechaFin: '2024-10-15' });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Se han obtenido los productos');
      expect(response.body.data).toBeDefined();
    });
});