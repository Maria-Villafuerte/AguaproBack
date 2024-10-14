import request from 'supertest';
import app from '../../src/main.js';

describe('GET /size', () => {
  it('Debería devolver los valores correctamente', async () => {
    const response = await request(app).get('/size');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Values retrieved successfully.');
    expect(response.body.data).toBeDefined();  // O define lo que esperas de los datos
  });

  it('Debería devolver un 404 cuando no haya valores', async () => {
    // Simular el caso cuando no hay valores
    const response = await request(app).get('/size');
    expect(response.status).toBe(404);
    expect(response.body.status).toBe('failed');
    expect(response.body.message).toBe('No values found.');
  });
});
