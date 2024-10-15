
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m30s', target: 10 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  const baseUrl = 'https://aguapro-back-git-main-villafuerte-mas-projects.vercel.app';

  // 1. POST /register
  const registerPayload = JSON.stringify({
    username: 'newuser',
    password: 'password123',
    email: 'newuser@example.com',
    role: 'user'
  });
  let res = http.post(`${baseUrl}/register`, registerPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Registro de usuario': (r) => r.status === 200 });
  sleep(1);

  // 2. POST /login
  const loginPayload = JSON.stringify({
    username: 'newuser',
    password: 'password123'
  });
  res = http.post(`${baseUrl}/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Inicio de sesión': (r) => r.status === 200 });
  sleep(1);

  // 3. POST /authenticate
  // Nota: Este endpoint requiere un token JWT, que normalmente se obtendría después de iniciar sesión
  res = http.post(`${baseUrl}/authenticate`, null, {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE'
    },
  });
  check(res, { 'Autenticación': (r) => r.status === 201 });
  sleep(1);

  // 4. POST /clientes
  const clientePayload = JSON.stringify({
    nombre: 'Nuevo Cliente',
    direccion: 'Calle 123',
    telefono: '1234567890',
    nit: '1234567890'
  });
  res = http.post(`${baseUrl}/clientes`, clientePayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Creación de cliente': (r) => r.status === 201 });
  sleep(1);

  // 5. POST /productos
  const productoPayload = JSON.stringify({
    nombre: 'Nuevo Producto',
    descripción: 'Descripción del nuevo producto',
    tipo_producto: 1
  });
  res = http.post(`${baseUrl}/productos`, productoPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Creación de producto': (r) => r.status === 201 });
  sleep(1);

  // 6. POST /size
  const sizePayload = JSON.stringify({
    min_gpm: 10,
    max_gpm: 20,
    range: 'M'
  });
  res = http.post(`${baseUrl}/size`, sizePayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Adición de tamaño': (r) => r.status === 200 });
  sleep(1);

  // 7. POST /condiciones
  const condicionesPayload = JSON.stringify({
    Temperatura_liquida_min: 0,
    Temperatura_liquida_max: 100,
    Temperatura_Ambiente: 25,
    presion: 1
  });
  res = http.post(`${baseUrl}/condiciones`, condicionesPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Adición de condiciones': (r) => r.status === 200 });
  sleep(1);

  // 8. POST /energia
  const energiaPayload = JSON.stringify({
    min_hp: 1,
    max_hp: 5,
    capacitor: 'Si'
  });
  res = http.post(`${baseUrl}/energia`, energiaPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Adición de energía': (r) => r.status === 200 });
  sleep(1);

  // 9. POST /tipos_producto
  const tipoProductoPayload = JSON.stringify({
    tipo: 'Nuevo Tipo'
  });
  res = http.post(`${baseUrl}/tipos_producto`, tipoProductoPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Adición de tipo de producto': (r) => r.status === 200 });
  sleep(1);

  // 10. POST /caracteristicas
  const caracteristicasPayload = JSON.stringify({
    marca: 'Marca',
    material: 'Material',
    profundidad: 10,
    conexion_tuberia: 'Tipo A',
    presion_funcional: 5,
    head: 20,
    flow_rate: 15,
    aplicaciones: 'Aplicación A',
    producto: 1,
    energia: 1,
    condiciones: 1,
    temperatura_media: 50
  });
  res = http.post(`${baseUrl}/caracteristicas`, caracteristicasPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Adición de características': (r) => r.status === 200 });
  sleep(1);

  // 11. POST /caracteristicas/variables
  const caracteristicasVariablesPayload = JSON.stringify({
    id_caracteristicas: 1,
    size: 1,
    precio: 100,
    disponibilidad: 10
  });
  res = http.post(`${baseUrl}/caracteristicas/variables`, caracteristicasVariablesPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Adición de características variables': (r) => r.status === 200 });
  sleep(1);

  // 12. POST /save_purchase
  const savePurchasePayload = JSON.stringify({
    clienteId: 1,
    productos: [
      { idProducto: 1, cantidad: 2, size: 'M' },
      { idProducto: 2, cantidad: 1, size: 'L' }
    ],
    nitEmpresa: '1234567890',
    idDescuento: null,
    direccion: 'Calle 123'
  });
  res = http.post(`${baseUrl}/save_purchase`, savePurchasePayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Guardar compra': (r) => r.status === 200 });
  sleep(1);

  // 13. POST /confirmacion
  const confirmacionPayload = JSON.stringify({
    mailto: 'cliente@example.com',
    subject: 'Confirmación de compra',
    html: '<h1>Gracias por su compra</h1>'
  });
  res = http.post(`${baseUrl}/confirmacion`, confirmacionPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Envío de confirmación por correo': (r) => r.status === 200 });
  sleep(1);
}