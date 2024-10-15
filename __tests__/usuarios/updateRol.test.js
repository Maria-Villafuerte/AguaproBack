import request from 'supertest';
import app from '../../src/main.js'; // Importa la aplicación

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

// Prueba para PUT /user/:id/role (cambiar rol del usuario)
describe('PUT /user/:id/role', () => {
    it('should update user role successfully', async () => {
      const userId = 62;
      const updatedRole = {
        role: 'admin',
      };
  
      const response = await request(app)
        .put(`/user/${userId}/role`)
        .send(updatedRole);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('User role updated successfully.');
    });
});