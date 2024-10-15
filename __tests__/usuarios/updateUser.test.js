import request from 'supertest';
import app from '../../src/main.js'; // Importa la aplicación

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

// Prueba para PUT /user/:id (actualizar username y email)
describe('PUT /user/:id', () => {
    it('should update user successfully', async () => {
      const userId = 22;
      const updatedData = {
        username: 'updateduser',
        email: 'updateduser@example.com',
      };
  
      const response = await request(app)
        .put(`/user/${userId}`)
        .send(updatedData);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('User updated successfully.');
    });
});