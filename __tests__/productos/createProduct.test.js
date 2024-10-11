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
  it('should create a new product and return 201', async () => {
    const newProduct = {
      nombre: 'Producto Nuevo',
      descripción: 'Descripción del producto',
      tipo_producto: 2
    };
    const response = await request(app).post('/productos').send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Product created successfully.');
    expect(response.body.data).toBeDefined();
  });
});
