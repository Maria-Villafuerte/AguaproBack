import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('POST /clientes', () => {
  it('should create a new client successfully', async () => {
    const newClient = {
      nombre: 'John Doe',
      direccion: '123 Calle Principal',
      telefono: '12345678',
      nit: '123456789'
    };

    const response = await request(app)
      .post('/clientes')
      .send(newClient);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Cliente creado exitosamente');
    expect(response.body.data).toBeDefined();
  });

});
