import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /energia', () => {
  it('Debería obtener los valores de energía exitosamente', async () => {
    const response = await request(app).get('/energia');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Values retrieved successfully.');
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true); // Verificar que data es un array
  });

  it('Debería devolver 404 si no se encuentran valores de energía', async () => {
    // Simular que no se encuentran valores
    const response = await request(app).get('/energia');
    
    expect(response.status).toBe(404);
    expect(response.body.status).toBe('failed');
    expect(response.body.message).toBe('No values found.');
  });
});
