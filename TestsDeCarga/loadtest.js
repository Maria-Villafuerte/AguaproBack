// Para correr test deben de ir a terminar y abrir la carpeta 
// cd .\__tests__\DeCarga\
// Luego Correr "k6 run loadtest.js "
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    // Esto simula un aumento rápido en el tráfico
    { duration: '1s', target: 20 },
    // Esta etapa simula un período de tráfico estable
    { duration: '2s', target: 10 },
    // Esto simula una disminución del tráfico
    { duration: '0s', target: 0 },
  ],
};

export default function () {
  // Test the root endpoint
  let res = http.get('https://aguapro-back-git-main-villafuerte-mas-projects.vercel.app');
  check(res, { 'root status was 200': (r) => r.status === 200 });
  sleep(1);

  // Test getting all products
  res = http.get('https://aguapro-back-git-main-villafuerte-mas-projects.vercel.app/productos');
  check(res, { 'get products status was 200': (r) => r.status === 200 });
  sleep(1);

  // Test getting visible products (catalog)
  res = http.get('https://aguapro-back-git-main-villafuerte-mas-projects.vercel.app/catalogo');
  check(res, { 'get catalog status was 200': (r) => r.status === 200 });
  sleep(1);

  // Test getting all clients
  res = http.get('https://aguapro-back-git-main-villafuerte-mas-projects.vercel.app/clientes');
  check(res, { 'get clients status was 200': (r) => r.status === 200 });
  sleep(1);

  // Test getting all orders
  res = http.get('https://aguapro-back-git-main-villafuerte-mas-projects.vercel.app/pedidos');
  check(res, { 'get orders status was 200': (r) => r.status === 200 });
  sleep(1);

  // Test user login (note: this is a POST request)
  const loginPayload = JSON.stringify({
    username: 'testuser',
    password: 'testpassword'
  });
  res = http.post('https://aguapro-back-git-main-villafuerte-mas-projects.vercel.app/login', loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'login status was 200': (r) => r.status === 200 });
  sleep(1);

  // Test getting sales statistics
  res = http.get('https://aguapro-back-git-main-villafuerte-mas-projects.vercel.app/sales?fechaInicio=2023-01-01&fechaFin=2023-12-31');
  check(res, { 'get sales statistics status was 200': (r) => r.status === 200 });
  sleep(1);
}