import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /clientes/:id', () => {
  it('should retrieve a client by ID successfully', async () => {
    const id = 1; // ID válido para obtener un cliente
    const response = await request(app).get(`/clientes/${id}`);
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Cliente obtenido exitosamente');
    expect(response.body.data).toBeDefined();
  });

  it('should return 404 if the client is not found', async () => {
    const id = 9999; // ID inexistente
    const response = await request(app).get(`/clientes/${id}`);
    
    expect(response.status).toBe(404);
    expect(response.body.status).toBe('failed');
    expect(response.body.message).toBe('Cliente no encontrado');
  });

});
