import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /clientes/user/:user_reference', () => {
  it('should retrieve the client successfully by user_reference', async () => {
    const user_reference = 2; // Ejemplo de referencia de usuario válida
    const response = await request(app).get(`/clientes/user/${user_reference}`);
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Cliente obtenido exitosamente');
    expect(response.body.data).toBeDefined();
  });

  it('should return 404 if the client is not found', async () => {
    const user_reference = 9999; // Ejemplo de referencia de usuario inexistente
    const response = await request(app).get(`/clientes/user/${user_reference}`);
    
    expect(response.status).toBe(404);
    expect(response.body.status).toBe('failed');
    expect(response.body.message).toBe('Cliente no encontrado');
  });
});
