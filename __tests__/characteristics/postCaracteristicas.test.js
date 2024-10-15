import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('POST /caracteristicas', () => {
    it('Debería añadir características exitosamente', async () => {
      const newCaracteristicas = {
        marca: 'MarcaX',
        material: 'Acero',
        profundidad: 1.5,
        conexion_tuberia: 'Rosca',
        presion_funcional: 2.5,
        head: 100,
        flow_rate: 200,
        aplicaciones: 'Riego',
        producto: 1,
        energia: 1,
        condiciones: 1,
        temperatura_media: 75.5
      };
      
      const response = await request(app).post('/caracteristicas').send(newCaracteristicas);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
    });
  
    it('Debería devolver un error 500 en caso de fallo', async () => {
      const newCaracteristicas = {}; // Datos incompletos para simular error
  
      const response = await request(app).post('/caracteristicas').send(newCaracteristicas);
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error en el servidor');
    });
  });
  