import request from 'supertest';
import app from '../../src/main.js'; // Importa la aplicación

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});
describe('GET /productos/:productId', () => {
  it('should retrieve a product by ID', async () => {
    const response = await request(app).get('/productos/3');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toHaveProperty('id_producto');
  });

  it('should return a 404 if product not found', async () => {
    const response = await request(app).get('/productos/999');

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('failed');
  });
});
