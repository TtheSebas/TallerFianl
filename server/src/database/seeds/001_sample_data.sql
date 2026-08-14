-- Datos de prueba para Taller 2.0

-- 3 productos
INSERT INTO productos (id, nombre, descripcion, categoria, es_personalizable) VALUES
  ('a1b2c3d4-e5f6-7890-1234-56789abcdef0', 'Mesa de Centro Rústica', 'Mesa de centro de madera maciza ideal para salas de estar modernas.', 'Salas', true),
  ('a1b2c3d4-e5f6-7890-1234-56789abcdef1', 'Librero Minimalista', 'Librero de 5 repisas estilo minimalista, perfecto para estudios.', 'Estudios', false),
  ('a1b2c3d4-e5f6-7890-1234-56789abcdef2', 'Escritorio Ejecutivo', 'Escritorio amplio de madera con detalles en metal y organizadores.', 'Oficinas', true);

-- 4 variantes
INSERT INTO variantes_producto (producto_id, sku, atributos, peso_kg, precio_actual, stock, tiempo_fabricacion_dias) VALUES
  ('a1b2c3d4-e5f6-7890-1234-56789abcdef0', 'MDC-ROBLE-120', '{"color": "roble natural", "material": "roble", "ancho_cm": 120, "profundidad_cm": 60, "alto_cm": 45}', 25.5, 3500.00, 5, 14),
  ('a1b2c3d4-e5f6-7890-1234-56789abcdef0', 'MDC-NOGAL-120', '{"color": "nogal oscuro", "material": "nogal", "ancho_cm": 120, "profundidad_cm": 60, "alto_cm": 45}', 27.0, 4200.00, 2, 14),
  ('a1b2c3d4-e5f6-7890-1234-56789abcdef1', 'LIB-BLANCO-180', '{"color": "blanco mate", "material": "pino", "ancho_cm": 80, "profundidad_cm": 30, "alto_cm": 180, "repisas": 5}', 35.0, 2800.00, 10, 7),
  ('a1b2c3d4-e5f6-7890-1234-56789abcdef2', 'ESC-METAL-MADERA', '{"color": "madera y negro", "material": "pino y metal", "ancho_cm": 150, "profundidad_cm": 70, "alto_cm": 75}', 45.0, 5800.00, 3, 21);

-- 2 clientes
INSERT INTO clientes (id, email, nombre_completo, telefono, direccion_envio, password_hash) VALUES
  ('b1c2d3e4-f5a6-7890-1234-56789abcdef0', 'juan.perez@email.com', 'Juan Pérez', '555-0100', 'Calle Falsa 123, Colonia Roma', '$2a$12$e/z1P/rZ2X7h/e0sO4Z/o.3T3x/c5p4M/X9X3P/e7x4Q/e1P/e/X/e'), -- hash simulado
  ('b1c2d3e4-f5a6-7890-1234-56789abcdef1', 'maria.garcia@email.com', 'María García', '555-0200', 'Avenida Siempre Viva 742', '$2a$12$e/z1P/rZ2X7h/e0sO4Z/o.3T3x/c5p4M/X9X3P/e7x4Q/e1P/e/X/e');

-- 1 cotización
INSERT INTO cotizaciones (cliente_id, email_solicitante, datos_proyecto, precio_estimado) VALUES
  ('b1c2d3e4-f5a6-7890-1234-56789abcdef0', 'juan.perez@email.com', '{"nombre": "Juan Pérez", "email": "juan.perez@email.com", "descripcion": "Mesa de comedor redonda", "dimensiones": {"alto": 75, "ancho": 120, "profundidad": 120}, "material": "roble", "acabados": ["barniz brillante"]}', 4800.00);
