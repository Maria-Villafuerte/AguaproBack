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
    const response = await request(app).get('/pedidos/1');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });

  it('should return a 404 if pedido not found', async () => {
    const response = await request(app).get('/pedidos/999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Pedido no encontrado');
  });
});
