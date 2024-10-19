import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('POST /productos', () => {
  it('should create a new product successfully', async () => {
    const newProduct = {
      id_producto: 1,
      nombre: 'Producto A',
      marca: 'Marca A',
      modelo: 'Modelo A',
      descripción: 'Descripción del producto A',
      material: 'Plástico',
      tipo_producto: 'Electrónico',
      capacidad: 100,
      precio: 150.00,
      disponibilidad: true
    };

    const response = await request(app)
      .post('/productos')
      .send(newProduct);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id_producto', 1);
    expect(response.body).toHaveProperty('nombre', 'Producto A');
  });

  it('should return 500 if product creation fails', async () => {
    const newProduct = {
      // Dejar algunos campos vacíos para forzar un error
      id_producto: null,
      nombre: '',
      marca: '',
      modelo: '',
      descripción: '',
      material: '',
      tipo_producto: '',
      capacidad: 0,
      precio: 0,
      disponibilidad: true
    };

    const response = await request(app)
      .post('/productos')
      .send(newProduct);

    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();
  });
});

