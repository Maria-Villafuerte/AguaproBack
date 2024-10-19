import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /pedidos/estado/:estadoId', () => {
  it('should retrieve pedidos by estado', async () => {
    const response = await request(app).get('/pedidos/estado/4');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toBeDefined();
  });

  it('should return 404 if no pedidos are found for the estado', async () => {
    const response = await request(app).get('/pedidos/estado/999');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('No se encontraron pedidos para el estado especificado.');
  });
});
