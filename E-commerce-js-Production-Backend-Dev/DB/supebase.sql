
-- PostgreSQL script

CREATE EXTENSION IF NOT EXISTS "pgcrypto";



CREATE TABLE administradores (
    admin_id UUID PRIMARY KEY,
    nombre_usuario VARCHAR,
    email VARCHAR,
    contrasena VARCHAR,
    verificado BOOLEAN
);

-- Tabla: categorias
CREATE TABLE categorias (
    categoria_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_categoria TEXT,
    activo BOOLEAN
);

-- Tabla: productos
CREATE TABLE productos (
    producto_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_producto VARCHAR,
    precio NUMERIC,
    categoria_id UUID REFERENCES categorias(categoria_id),
    activacion BOOLEAN,
    descripcion TEXT,
    detalles TEXT,
    created_at TIMESTAMPTZ DEFAULT now()

);

-- Tabla: talles
CREATE TABLE talles (
    talle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insertar_talle VARCHAR
);

-- Tabla: colores
CREATE TABLE colores (
    color_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insertar_color VARCHAR
);

-- Tabla: variantes
CREATE TABLE productos_variantes (
    variante_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id UUID REFERENCES productos(producto_id),
    talle_id UUID REFERENCES talles(talle_id),
    color_id UUID REFERENCES colores(color_id),
    stock INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()

);

-- Tabla: usuarios
CREATE TABLE usuarios (
    usuario_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR,
    contrasena VARCHAR,
    verificado BOOLEAN,
    dni BIGINT,
    apellido VARCHAR,
    nombre VARCHAR,
    usuario VARCHAR
);

-- Tabla: pedidos
CREATE TABLE pedidos (
    pedido_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total NUMERIC,
    usuario_id UUID REFERENCES usuarios(usuario_id),
    estado TEXT,
    fecha_creacion TIMESTAMPTZ,
    preference_id TEXT
);

-- Tabla: detalle_pedidos
CREATE TABLE detalle_pedidos (
    detalle_pedido_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID REFERENCES pedidos(pedido_id),
    cantidad INTEGER,
    precio_unitario NUMERIC,
    variante_id UUID REFERENCES productos_variantes(variante_id),
    producto_id UUID REFERENCES productos(producto_id),
    created_at TIMESTAMPTZ DEFAULT now()

);

-- Tabla: imagenes
CREATE TABLE imagenes (
    imagenes_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id UUID REFERENCES productos(producto_id),
    urls TEXT [] NOT NULL
);



-- Tabla: carritos_temporales
CREATE TABLE carritos_temporales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carrito JSONB,
    total NUMERIC,
    fecha_creacion TIMESTAMPTZ,
    external_reference UUID,
    user_id UUID REFERENCES usuarios(usuario_id),
    created_at TIMESTAMPTZ DEFAULT now()
    
);

-- Tabla: pagos
CREATE TABLE pagos (
    pago_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id BIGINT,
    status VARCHAR,
    preference_id VARCHAR,
    transaction_amount NUMERIC,
    usuario_id UUID REFERENCES usuarios(usuario_id),
    created_at TIMESTAMPTZ DEFAULT now()

);
