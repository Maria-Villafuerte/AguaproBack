import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /pedidos', () => {
  it('should retrieve all pedidos', async () => {
    const response = await request(app).get('/pedidos');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toBeDefined();
  });

  it('should return 500 for server errors', async () => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
    const response = await request(app).get('/pedidos');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
});
