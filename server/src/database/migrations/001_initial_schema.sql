-- ==========================================================
-- Taller 2.0 — Esquema inicial de base de datos
-- Base de datos: PostgreSQL 16+
-- ==========================================================

-- Tabla de productos base (muebles de catálogo o personalizables)
CREATE TABLE IF NOT EXISTS productos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          VARCHAR(255) NOT NULL,
    descripcion     TEXT,
    categoria       VARCHAR(100),
    es_personalizable BOOLEAN DEFAULT false,
    fecha_creacion  TIMESTAMP DEFAULT now()
);

-- Variantes (SKU) con atributos dinámicos en JSONB y control de inventario
CREATE TABLE IF NOT EXISTS variantes_producto (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id     UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    sku             VARCHAR(100) UNIQUE NOT NULL,
    atributos       JSONB NOT NULL,
    peso_kg         DECIMAL(6,2),
    precio_actual   DECIMAL(12,2) NOT NULL,
    stock           INTEGER DEFAULT 0,
    tiempo_fabricacion_dias INTEGER DEFAULT 7,
    activo          BOOLEAN DEFAULT true
);

-- Clientes (registro y checkout)
CREATE TABLE IF NOT EXISTS clientes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    telefono        VARCHAR(20),
    direccion_envio TEXT,
    password_hash   VARCHAR(255),
    auth_proveedor  VARCHAR(50) DEFAULT 'local',
    fecha_registro  TIMESTAMP DEFAULT now()
);

-- Pedidos (ventas confirmadas)
CREATE TABLE IF NOT EXISTS pedidos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id      UUID NOT NULL REFERENCES clientes(id),
    estado          VARCHAR(50) DEFAULT 'pendiente',
    subtotal        DECIMAL(12,2) NOT NULL,
    costo_envio     DECIMAL(12,2) DEFAULT 0,
    costo_instalacion DECIMAL(12,2) DEFAULT 0,
    total           DECIMAL(12,2) NOT NULL,
    direccion_envio TEXT NOT NULL,
    zona_envio      VARCHAR(100),
    factura_electronica_id VARCHAR(255),
    fecha_creacion  TIMESTAMP DEFAULT now()
);

-- Detalle de pedido (relación variantes compradas)
CREATE TABLE IF NOT EXISTS pedido_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id       UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    variante_id     UUID NOT NULL REFERENCES variantes_producto(id),
    cantidad        INTEGER NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(12,2) NOT NULL
);

-- Actas de entrega generadas automáticamente
CREATE TABLE IF NOT EXISTS actas_entrega (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id       UUID NOT NULL REFERENCES pedidos(id),
    url_pdf         VARCHAR(500) NOT NULL,
    contenido_json  JSONB,
    fecha_generacion TIMESTAMP DEFAULT now()
);

-- Cotizaciones (presupuestos enviados por el módulo a medida)
CREATE TABLE IF NOT EXISTS cotizaciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id      UUID REFERENCES clientes(id),
    email_solicitante VARCHAR(255) NOT NULL,
    datos_proyecto  JSONB NOT NULL,
    precio_estimado DECIMAL(12,2),
    pdf_generado    VARCHAR(500),
    fecha_creacion  TIMESTAMP DEFAULT now()
);

-- ==========================================================
-- Índices para rendimiento
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_variantes_producto_id ON variantes_producto(producto_id);
CREATE INDEX IF NOT EXISTS idx_variantes_sku ON variantes_producto(sku);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedido_items_pedido_id ON pedido_items(pedido_id);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_email ON cotizaciones(email_solicitante);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente_id ON cotizaciones(cliente_id);
