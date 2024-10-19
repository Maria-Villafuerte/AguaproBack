import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('POST /capacidad', () => {
    it('Debería añadir una variación de capacidad exitosamente', async () => {
      const newTipo = { cap_min: 20.0, cap_max: 25.5 };
      
      const response = await request(app).post('/capacidad').send(newTipo);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
    });
  
    it('Debería devolver un error 500 en caso de fallo', async () => {
      const newTipo = {}; // Datos incompletos para simular error
  
      const response = await request(app).post('/capacidad').send(newTipo);
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error en el servidor');
    });
  });
  