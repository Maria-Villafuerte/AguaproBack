import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('PUT /clientes/user/:id', () => {
  it('should update the client successfully and return 200', async () => {
    const id = 1; // ID del cliente válido para actualizar
    const updatedClientData = {
      user_reference: 25 // Ejemplo de nuevos datos de referencia de usuario
    };
    
    const response = await request(app).put(`/clientes/user/${id}`).send(updatedClientData);
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Cliente actualizado exitosamente');
    expect(response.body.data).toBeDefined();
  });

  it('should return 404 if the client is not found', async () => {
    const id = 9999; // ID inexistente de cliente
    const updatedClientData = {
      user_reference: 15
    };

    const response = await request(app).put(`/clientes/user/${id}`).send(updatedClientData);
    
    expect(response.status).toBe(404);
    expect(response.body.status).toBe('failed');
    expect(response.body.message).toBe('Cliente no encontrado');
  });

  it('should return 404 if the user is not found', async () => {
    const id = 3; 
    const updatedClientData = {
      user_reference: 12345 // ID inexistente de usuario
    };

    const response = await request(app).put(`/clientes/user/${id}`).send(updatedClientData);
    
    expect(response.status).toBe(404);
    expect(response.body.status).toBe('failed');
    expect(response.body.message).toBe('Cliente no encontrado');
  });
});
