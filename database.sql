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
