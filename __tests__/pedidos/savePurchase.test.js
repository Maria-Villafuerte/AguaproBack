import request from 'supertest';
import app from '../../src/main.js'; // Importa la aplicación

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('POST /save_purchase', () => {
  it('should save a purchase successfully', async () => {
    const purchaseData = {
      clienteId: 1,
      productos: [{ id: 101, cantidad: 2 }, { id: 102, cantidad: 1 }],
      nitEmpresa: '1234567-8',
      idDescuento: 1,
      direccion: 'Calle Falsa 123',
    };

    const response = await request(app)
      .post('/save_purchase')
      .send(purchaseData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Compra guardada exitosamente.');
    expect(response.body.pedidoId).toBeDefined(); // Verifica que se devuelva el ID del pedido
  });

  it('should return a 400 if purchase data is invalid', async () => {
    const invalidPurchaseData = {
      clienteId: null,
      productos: [],
      nitEmpresa: '',
      idDescuento: null,
      direccion: '',
    };

    const response = await request(app)
      .post('/save_purchase')
      .send(invalidPurchaseData);

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined(); // Verifica que se devuelva un mensaje de error
  });

  it('should return a 500 if there is a server error', async () => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {}); // Evita mostrar errores en consola

    const purchaseData = {
      clienteId: 1,
      productos: [{ id: 101, cantidad: 2 }],
      nitEmpresa: '1234567-8',
      idDescuento: 1,
      direccion: 'Calle Falsa 123',
    };

    const savePurchase = jest.fn(() => { throw new Error('Database error'); });
    
    const response = await request(app)
      .post('/save_purchase')
      .send(purchaseData);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  });
});