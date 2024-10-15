import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('POST /tipos_producto', () => {
    it('Debería añadir un tipo de producto exitosamente', async () => {
      const newTipo = { tipo: 'Electrónico' };
      
      const response = await request(app).post('/tipos_producto').send(newTipo);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
    });
  
    it('Debería devolver un error 500 en caso de fallo', async () => {
      const newTipo = {}; // Datos incompletos para simular error
  
      const response = await request(app).post('/tipos_producto').send(newTipo);
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error en el servidor');
    });
  });
  