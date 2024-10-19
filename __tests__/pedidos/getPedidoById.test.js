import request from 'supertest';
import app from '../../src/main.js'; // Importa la aplicación

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});
describe('GET /pedidos/:pedidoId', () => {
  it('should retrieve a pedido by ID', async () => {
    const response = await request(app).get('/pedidos/8');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });
});
