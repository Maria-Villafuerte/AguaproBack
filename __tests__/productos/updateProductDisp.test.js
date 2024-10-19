import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('PUT /productos/:id/disp', () => {
    it('should update product availability successfully', async () => {
      const availabilityUpdate = {
        disponibilidad: 180
      };
  
      const productId = 1;
      const response = await request(app)
        .put(`/productos/${productId}/disp`)
        .send(availabilityUpdate);
  
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Product availability updated successfully.');
    });
  
    it('should return 404 if product not found', async () => {
      const availabilityUpdate = {
        disponibilidad: 0
      };
  
      const invalidProductId = 999; // Simulando un ID inexistente
      const response = await request(app)
        .put(`/productos/${invalidProductId}/disp`)
        .send(availabilityUpdate);
  
      expect(response.status).toBe(404);
      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Product not found.');
    });
});  