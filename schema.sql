-- Tabla Tipo_producto
CREATE TABLE Tipo_producto (
    id_tipo INT PRIMARY KEY,
    nombre VARCHAR(30)
);

-- Tabla Productos
CREATE TABLE Productos (
    id_producto INT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    descripción VARCHAR(100) NOT NULL,
    material VARCHAR(50) NOT NULL,
    tipo_producto INT NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'en venta',
    precio DOUBLE PRECISION,
    disponibilidad INT,
    cap_min DOUBLE PRECISION,
    cap_max DOUBLE PRECISION,
    FOREIGN KEY (tipo_producto) REFERENCES Tipo_producto(id_tipo)
);

-- Tabla Clientes
CREATE TABLE Clientes (
    id_cliente INT PRIMARY KEY,
    nombre VARCHAR(50),
    direccion VARCHAR(100),
    telefono VARCHAR(8),
    nit VARCHAR(10),
    user_reference INT,
    FOREIGN KEY (user_reference) REFERENCES users(id)
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
    direccion VARCHAR(100),
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
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    Precio_unitario DOUBLE PRECISION,
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


