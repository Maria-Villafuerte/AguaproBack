import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /clientes', () => {
  it('should retrieve all clients successfully', async () => {
    const response = await request(app).get('/clientes');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Clientes obtenidos exitosamente');
    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true); // Verificar que data sea un array
  });

});
