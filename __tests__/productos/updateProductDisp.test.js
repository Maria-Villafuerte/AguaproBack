import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('PUT /product/:id/disp', () => {
    it('should update product availability successfully', async () => {
      const availabilityUpdate = {
        disponibilidad: true
      };
  
      const productId = 1;
      const response = await request(app)
        .put(`/product/${productId}/disp`)
        .send(availabilityUpdate);
  
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Product availability updated successfully.');
    });
  
    it('should return 404 if product not found', async () => {
      const availabilityUpdate = {
        disponibilidad: false
      };
  
      const invalidProductId = 999; // Simulando un ID inexistente
      const response = await request(app)
        .put(`/product/${invalidProductId}/disp`)
        .send(availabilityUpdate);
  
      expect(response.status).toBe(404);
      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Product not found.');
    });
});  