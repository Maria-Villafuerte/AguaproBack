import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('PUT /productos/:productId', () => {
  it('should update an existing product and return 200', async () => {
    const updatedProduct = {
      nombre: 'Producto Actualizado',
      descripción: 'Nueva descripción',
      tipo_producto: 2
    };
    const response = await request(app).put('/productos/1').send(updatedProduct);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product updated successfully');
  });

  it('should return 404 if product is not found', async () => {
    const updatedProduct = {
      nombre: 'Producto Actualizado',
      descripción: 'Nueva descripción',
      tipo_producto: 2
    };
    const response = await request(app).put('/productos/999').send(updatedProduct);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Product not found');
  });
});
