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
});
