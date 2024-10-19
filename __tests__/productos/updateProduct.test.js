import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('PUT /productos/:id', () => {
  it('should update a product successfully', async () => {
    const updatedProduct = {
      nombre: 'Producto B Actualizado',
      marca: 'Marca B',
      modelo: 'Modelo B',
      descripción: 'Descripción del producto B actualizada',
      material: 'Metal',
      tipo_producto: 'Mecánico',
      capacidad: 200,
      precio: 250.00,
      disponibilidad: false
    };

    const productId = 1;
    const response = await request(app)
      .put(`/productos/${productId}`)
      .send(updatedProduct);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Product updated successfully.');
  });

  it('should return 404 if product not found', async () => {
    const updatedProduct = {
      nombre: 'Producto No Existente',
      marca: 'Marca C',
      modelo: 'Modelo C',
      descripción: 'Descripción de un producto que no existe',
      material: 'Vidrio',
      tipo_producto: 'Decorativo',
      capacidad: 300,
      precio: 350.00,
      disponibilidad: true
    };

    const invalidProductId = 999; // Simulando un ID inexistente
    const response = await request(app)
      .put(`/productos/${invalidProductId}`)
      .send(updatedProduct);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('failed');
    expect(response.body.message).toBe('Product not found.');
  });
});