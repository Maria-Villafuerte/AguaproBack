-- Tabla Tipo_producto
CREATE TABLE Tipo_producto (
    id_tipo INT PRIMARY KEY,
    nombre VARCHAR(30)
);

-- Tabla Productos
CREATE TABLE Productos (
    id_producto INT PRIMARY KEY,
    nombre VARCHAR(30),
    descripción TEXT,
    precio DOUBLE PRECISION,
    disponibilidad INT,
    tipo_producto INT,
    FOREIGN KEY (tipo_producto) REFERENCES Tipo_producto(id_tipo)
);

ALTER TABLE Productos 
ADD COLUMN estado VARCHAR(50) NOT NULL DEFAULT 'en venta';

-- Tabla Energía
CREATE TABLE Energía (
    energia INT PRIMARY KEY,
    min_hp DOUBLE PRECISION,
    max_hp DOUBLE PRECISION,
    capacitor VARCHAR
);

-- Tabla Condiciones
CREATE TABLE Condiciones (
    condiciones INT PRIMARY KEY,
    Temperatura_liquida_min DOUBLE PRECISION,
    Temperatura_liquida_max DOUBLE PRECISION,
    Temperatura_Ambiente DOUBLE PRECISION,
    presion DOUBLE PRECISION
);

-- Tabla Size
CREATE TABLE Size (
    Size INT PRIMARY KEY,
    min_gpm DOUBLE PRECISION,
    max_gpm DOUBLE PRECISION
);

-- Tabla Características
CREATE TABLE Características (
    marca VARCHAR(50),
    size INT,
    material VARCHAR(50),
    profundidad DOUBLE PRECISION,
    conexion_tuberia VARCHAR(50),
    presion_funcional DOUBLE PRECISION,
    head INT,
    flow_rate DOUBLE PRECISION,
    aplicaciones TEXT,
    producto INT,
    energia INT,
    condiciones INT,
    temperatura_media DOUBLE PRECISION,
    FOREIGN KEY (size) REFERENCES Size(Size),
    FOREIGN KEY (producto) REFERENCES Productos(id_producto),
    FOREIGN KEY (energia) REFERENCES Energía(energia),
    FOREIGN KEY (condiciones) REFERENCES Condiciones(condiciones)
);

-- Tabla Clientes
CREATE TABLE Clientes (
    id_cliente INT PRIMARY KEY,
    nombre VARCHAR(50),
    direccion VARCHAR(100),
    telefono VARCHAR(8),
    nit VARCHAR(10)
);

-- Tabla Tipos_estados
CREATE TABLE Tipos_estados (
    id_estado INT PRIMARY KEY,
    nombre VARCHAR(50)
);

-- Tabla Pedidos
CREATE TABLE Pedidos (
    id_pedido INT PRIMARY KEY,
    estatus INT,
    FOREIGN KEY (estatus) REFERENCES Tipos_estados(id_estado)
);

-- Tabla Codigo
CREATE TABLE Codigos (
    id_codigo INT PRIMARY KEY,
    num_codigo VARCHAR(10),
    usado INT,
    descuento DOUBLE PRECISION,
    fecha_vencimiento DATE,
    validez BOOLEAN,
    producto INT,
    FOREIGN KEY (producto) REFERENCES Productos(id_producto)
);

-- Tabla Factura
CREATE TABLE Factura (
    id_cliente INT,
    id_pedido INT,
    nit_empresa VARCHAR(10),
    monto_total DOUBLE PRECISION,
    id_descuento INT,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido),
    FOREIGN KEY (id_descuento) REFERENCES Codigos(id_codigo)
);

-- Tabla Servicio
CREATE TABLE Servicio (
    id_servicio INT PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion TEXT
);

-- Tabla Recuento
-- Para que nos sirva como intermediario entre pedidos y productos, por si acaso se compra 2 productos del mismo tipo en el mismo pedido.
CREATE TABLE Recuento (
    Pedido_Fk INT,
    Producto_Fk INT,
    Cantidad INT,
    FOREIGN KEY (Pedido_Fk) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (Producto_Fk) REFERENCES productos(id_producto)
);

-- Tabla Descuentos
CREATE TABLE Descuentos (
    producto INT,
    porcentaje DOUBLE PRECISION,
    FOREIGN KEY (producto) REFERENCES Productos(id_producto)
);

-- Tabla de Usuarios
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


