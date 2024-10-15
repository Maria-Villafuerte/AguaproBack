import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('POST /size', () => {
    it('Debería añadir un valor de tamaño exitosamente', async () => {
      const newSize = {
        min_gpm: 3,
        max_gpm: 85,
        range: '4'
      };
      
      const response = await request(app).post('/size').send(newSize);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
    });
  
    it('Debería devolver un error 500 en caso de fallo', async () => {
      const newSize = {}; // Datos incompletos para simular error
  
      const response = await request(app).post('/size').send(newSize);
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error en el servidor');
    });
  });
  