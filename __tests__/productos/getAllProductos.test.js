import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /productos', () => {
  it('should retrieve all products successfully', async () => {
    const response = await request(app).get('/productos');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('productos retrieved successfully.');
    expect(response.body.data).toBeDefined();
  });
});
