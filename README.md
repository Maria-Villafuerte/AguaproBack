# AguaproBack

Este es el repositorio backend para el proyecto Aguatesa, una empresa que se especializa en la venta de productos como bombas de agua, tubos y artefactos para perforación de pozos. Este proyecto está siendo desarrollado por un equipo de cinco estudiantes de informática, con el objetivo de crear una plataforma completa para la gestión de ventas, búsquedas y pagos electrónicos.

## Integrantes del Equipo

El equipo de desarrollo está compuesto por los siguientes integrantes:

- **Diego Duarte** - 22075 
- **Nicolle Gordillo** - 22246 
- **Sofía Velasquez** - 22049 
- **Maria Jose Villafuerte** - 22129 
- **Fabiola Contreras** - 22787 

## Descripción del Proyecto

AguaproBack es la parte backend del sistema, encargado de manejar las operaciones relacionadas con la gestión de productos, clientes, pedidos, y la autenticación de usuarios. Este backend está construido utilizando Node.js y se conecta a una base de datos SQL para almacenar y gestionar la información del sistema.


## Características Principales

- **Gestión de Productos:** CRUD para productos, permitiendo a los administradores agregar, modificar, y eliminar productos.
- **Gestión de Clientes:** CRUD para clientes, con funcionalidades para el registro y autenticación de usuarios.
- **Gestión de Pedidos:** Creación y modificación de pedidos, con la capacidad de ver detalles completos de cada pedido.
- **Facturación:** Manejo de facturas asociadas a los pedidos, incluyendo el cálculo de descuentos.
- **Autenticación:** Sistema de login para usuarios administradores con gestión de roles y permisos.

## Tecnologías Utilizadas

- **Node.js**
- **Express.js**
- **SQL (PostgreSQL/MySQL)**
- **Vercel** para el despliegue

## Estructura del Proyecto

El código está organizado en varios archivos y carpetas para facilitar la navegación y el mantenimiento:

- `src/`
  - `controllers/`: Controladores que manejan la lógica de la aplicación.
  - `models/`: Modelos de datos para la interacción con la base de datos.
  - `routes/`: Definición de las rutas de la API.
  - `db.js`: Configuración y manejo de la conexión a la base de datos.
  - `main.js`: Archivo principal que inicia la aplicación.

