import request from 'supertest';
import app from '../../src/main.js';

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll((done) => {
  server.close(done);
});

describe('DELETE /delete_purchase/:pedidoId', () => {
  it('should delete a purchase successfully', async () => {
    const response = await request(app).delete('/delete_purchase/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBeDefined();
  });

  it('should return 400 for an invalid purchase ID', async () => {
    const response = await request(app).delete('/delete_purchase/999');
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
