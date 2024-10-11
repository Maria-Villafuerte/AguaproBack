import request from 'supertest';
import app from '../../src/main.js'; // Importa la aplicación

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});
describe('POST /login', () => {
  it('should log in an existing user', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body).toHaveProperty('token');
  });

  it('should fail to log in with incorrect credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('failed');
  });

  it('should fail to log in with no credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: '',
        password: ''
      });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('failed');
  });
});
