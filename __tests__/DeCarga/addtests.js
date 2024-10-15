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

  // Agregar productos al carrito de compras
  const addToCartPayload = JSON.stringify({
    userId: 1,
    productId: 2,
    quantity: 3
  });
  let res = http.post(`${baseUrl}/cart/add`, addToCartPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Agregar productos al carrito de compras': (r) => r.status === 200 });
  sleep(1);

  // Agregar nuevos pedidos
  const newOrderPayload = JSON.stringify({
    clienteId: 1,
    productos: [
      { idProducto: 2, cantidad: 3, size: 'M' },
      { idProducto: 4, cantidad: 1, size: 'L' }
    ],
    nitEmpresa: '123456789',
    direccion: 'Calle Principal 123'
  });
  res = http.post(`${baseUrl}/save_purchase`, newOrderPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Agregar nuevos pedidos': (r) => r.status === 200 });
  sleep(1);

  // Agregar nuevos productos
  const newProductPayload = JSON.stringify({
    nombre: 'Nuevo Producto',
    descripción: 'Descripción del nuevo producto',
    tipo_producto: 1
  });
  res = http.post(`${baseUrl}/productos`, newProductPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Agregar nuevos productos': (r) => r.status === 201 });
  sleep(1);

  // Agregar Solicitudes de Servicios
  const newServiceRequestPayload = JSON.stringify({
    clienteId: 1,
    tipoServicio: 'Instalación',
    descripcion: 'Necesito instalar una bomba de agua',
    fechaSolicitada: '2023-06-01'
  });
  res = http.post(`${baseUrl}/service_request`, newServiceRequestPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, { 'Agregar Solicitudes de Servicios': (r) => r.status === 200 });
  sleep(1);
}
