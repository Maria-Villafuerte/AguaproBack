import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('POST /energia', () => {
    it('Debería añadir un valor de energía exitosamente', async () => {
      const newEnergy = {
        min_hp: 1,
        max_hp: 5,
        capacitor: 'Capacitor ABC'
      };
      
      const response = await request(app).post('/energia').send(newEnergy);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
    });
  
    it('Debería devolver un error 500 en caso de fallo', async () => {
      const newEnergy = {}; // Datos incompletos para simular error
  
      const response = await request(app).post('/energia').send(newEnergy);
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error en el servidor');
    });
  });
  