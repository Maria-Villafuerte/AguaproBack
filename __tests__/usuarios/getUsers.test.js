import request from 'supertest';
import app from '../../src/main.js'; // Importa la aplicación

let server;

beforeAll(() => {
  server = app.listen(0);  // Usa el puerto 0 para que el sistema operativo asigne uno automáticamente
});

afterAll((done) => {
  server.close(done);  // Cierra el servidor después de las pruebas
});

describe('GET /users', () => {
  it('should retrieve all users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200); // Verifica que el estado sea 200
    expect(response.body.status).toBe('success'); // Verifica que el status sea success
    expect(Array.isArray(response.body.data)).toBe(true); // Verifica que data sea un array
    expect(response.body.data.length).toBeGreaterThan(0); // Verifica que el array no esté vacío

    // Verifica que cada usuario tenga las propiedades esperadas
    response.body.data.forEach(user => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('created_at');
    });
  });
});
