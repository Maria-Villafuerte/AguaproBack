import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

  // Prueba para GET /sales/sum
  describe('GET /sales/sum', () => {
    it('should retrieve total sales successfully for given dates', async () => {
      const response = await request(app).get('/sales/sum')
        .query({ fechaInicio: '2024-10-13', fechaFin: '2024-10-15' });
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Se han obtenido las ventas.');
      expect(response.body.data).toBeDefined();
    });
});