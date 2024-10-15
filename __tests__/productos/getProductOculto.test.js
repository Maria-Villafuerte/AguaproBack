import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /catalogooculto', () => {
  it('should retrieve all visible pedidos', async () => {
    const response = await request(app).get('/catalogooculto');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toBeDefined();
  });
});
