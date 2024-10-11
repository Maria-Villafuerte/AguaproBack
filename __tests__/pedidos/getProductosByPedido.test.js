import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /pedidos/:pedidoId/productos', () => {
  it('should retrieve products for a pedido', async () => {
    const response = await request(app).get('/pedidos/1/productos');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toBeDefined();
  });

  it('should return 404 if no products are found for the pedido', async () => {
    const response = await request(app).get('/pedidos/999/productos');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('No se encontraron productos para el pedido especificado.');
  });

  it('should return 500 for server errors', async () => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
    const response = await request(app).get('/pedidos/500/productos');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
});