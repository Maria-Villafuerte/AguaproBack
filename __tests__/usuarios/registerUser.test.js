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
    it('should not register a duplicated user mail', async () => {
      const newUser = {
        username: 'testuser',
        password: 'password123',
        email: 'testuser@example.com'
      };
  
      const response = await request(app)
        .post('/register')
        .send(newUser);
      
      expect(response.status).toBe(500);
      expect(response.body.status).toBe('failed');
    });
});
  
  
  
  
  