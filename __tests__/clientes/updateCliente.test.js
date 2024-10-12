import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('PUT /clientes/:id', () => {
  it('should update the client successfully and return 200', async () => {
    const id = 3; // ID válido para actualizar
    const updatedClientData = {
      nombre: 'Jane Doe',
      direccion: '456 Calle Secundaria',
      telefono: '87654321',
      nit: '987654321',
      user_reference: 15
    };
    
    const response = await request(app)
      .put(`/clientes/${id}`)
      .send(updatedClientData);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Cliente actualizado exitosamente');
    expect(response.body.data).toBeDefined();
  });

  it('should return 404 if the client is not found', async () => {
    const id = 9999; // ID inexistente
    const updatedClientData = {
      nombre: 'Jane Doe',
      direccion: '456 Calle Secundaria',
      telefono: '87654321',
      nit: '987654321',
      user_reference: 5
    };

    const response = await request(app)
      .put(`/clientes/${id}`)
      .send(updatedClientData);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('failed');
    expect(response.body.message).toBe('Cliente no encontrado');
  });

});
