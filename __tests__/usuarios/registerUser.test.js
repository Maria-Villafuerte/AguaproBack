import request from 'supertest';
import app from '../../src/main.js'; // Importa la aplicación

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

// Prueba para POST /register
describe('POST /register', () => {
    it('should register a user successfully', async () => {
      const newUser = {
        username: 'testuser',
        password: 'password123',
        email: 'testuser@example.com',
        role: 'user',
      };
  
      const response = await request(app)
        .post('/register')
        .send(newUser);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('User registered successfully.');
    });
});
  
  
  
  
  