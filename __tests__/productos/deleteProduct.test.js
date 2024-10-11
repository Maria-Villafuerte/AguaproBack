import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('PUT /productos/hide/:productId', () => {
  it('should hide a product by ID and return 204', async () => {
    const response = await request(app).put('/productos/hide/1');
    expect(response.status).toBe(204);
  });

  it('should return 500 if there is a server error', async () => {
    const response = await request(app).put('/productos/hide/999');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
});
