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
    expect(response.body.message).toBe('Posts retrieved successfully.');
    expect(response.body.data).toBeDefined();
  });

  it('should return 404 if no products are found', async () => {
    const response = await request(app).get('/productos');
    expect(response.status).toBe(404);
    expect(response.body.status).toBe('failed');
    expect(response.body.message).toBe('No posts found.');
  });

  it('should return 500 if there is a server error', async () => {
    const response = await request(app).get('/productos');
    expect(response.status).toBe(500);
    expect(response.body.status).toBe('failed');
    expect(response.body.error).toBeDefined();
  });
});
