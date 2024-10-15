import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('PUT /caracteristicas/:id_caracteristicas', () => {
    it('Debería actualizar características correctamente', async () => {
      const updateCaracteristicas = {
        marca: 'MarcaActualizada',
        material: 'Plástico',
        profundidad: 1.8,
        conexion_tuberia: 'Soldadura',
        presion_funcional: 3.0,
        head: 150,
        flow_rate: 250,
        aplicaciones: 'Industria',
        producto: 2,
        energia: 2,
        condiciones: 2,
        temperatura_media: 80.0
      };
  
      const response = await request(app)
        .put('/caracteristicas/1')
        .send(updateCaracteristicas);
  
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeDefined();
    });
  
    it('Debería devolver un error 500 en caso de fallo', async () => {
      const response = await request(app).put('/caracteristicas/1').send({});
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error al actualizar características');
    });
  });
  