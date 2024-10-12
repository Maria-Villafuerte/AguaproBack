import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /search/:searchTerm', () => {
  it('should return pedidos matching the search term', async () => {
    const response = await request(app).get('/search/Cliente B');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toBe('Se han obtenido los pedidos.');
  });

  it('should return 404 if no pedidos are found', async () => {
    const response = await request(app).get('/search/nonexistentTerm');
    expect(response.status).toBe(404);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('No se encontraron pedidos');
  });
});
