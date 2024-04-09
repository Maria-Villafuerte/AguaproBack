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

-- Tabla Energía
CREATE TABLE Energía (
    energia INT PRIMARY KEY,
    min_hp DOUBLE PRECISION,
    max_hp DOUBLE PRECISION,
    capacitor VARCHAR
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
    monto_total DOUBLE PRECISION,
    estatus INT,
    FOREIGN KEY (estatus) REFERENCES Tipos_estados(id_estado)
);

-- Tabla Factura
CREATE TABLE Factura (
    id_cliente INT,
    id_pedido INT,
    nit_empresa VARCHAR(10),
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido)
);

-- Tabla Servicio
CREATE TABLE Servicio (
    id_servicio INT PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion TEXT
);

