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
      nombre: 'Producto A',
      marca: 'Marca A',
      modelo: 'Modelo A',
      descripción: 'Descripción del producto A',
      material: 'Plástico',
      tipo_producto: 6,
      capacidad_min: 20.0, 
      capacidad_max: 35.0,
      precio: 250.00,
      disponibilidad: 450
    };

    const response = await request(app)
      .post('/productos')
      .send(newProduct);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Product created successfully.');
    expect(response.body.data).toBeDefined();
  });

  it('should return 500 if product creation fails', async () => {
    const newProduct = {
      // Dejar campos vacíos para forzar un error
    };

    const response = await request(app)
      .post('/productos')
      .send(newProduct);

    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();
  });
});

