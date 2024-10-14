import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /condiciones', () => {
    it('Debería devolver las condiciones correctamente', async () => {
      const response = await request(app).get('/condiciones');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Values retrieved successfully.');
      expect(response.body.data).toBeDefined();
    });
  
    it('Debería devolver un 404 cuando no haya valores', async () => {
      const response = await request(app).get('/condiciones');
      expect(response.status).toBe(404);
      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('No values found.');
    });
  });
  