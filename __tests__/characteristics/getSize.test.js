import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /size', () => {
  it('Debería devolver los valores correctamente', async () => {
    const response = await request(app).get('/size');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Values retrieved successfully.');
    expect(response.body.data).toBeDefined();  // O define lo que esperas de los datos
  });
});
