import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('POST /condiciones', () => {
    it('Debería añadir condiciones exitosamente', async () => {
      const newCondition = {
        Temperatura_liquida_min: 5,
        Temperatura_liquida_max: 50,
        Temperatura_Ambiente: 25,
        presion: 1.2
      };
      
      const response = await request(app).post('/condiciones').send(newCondition);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
    });
  
    it('Debería devolver un error 500 en caso de fallo', async () => {
      const newCondition = {}; // Datos incompletos para simular error
  
      const response = await request(app).post('/condiciones').send(newCondition);
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error en el servidor');
    });
  });
  