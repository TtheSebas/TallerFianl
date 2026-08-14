/**
 * @fileoverview Types and interfaces for Taller 2.0 furniture store API.
 * Reflects the Spanish-language PostgreSQL schema.
 */

/* ------------------------------------------------------------------ */
/*  Enums                                                             */
/* ------------------------------------------------------------------ */

/** Estado del pedido */
export enum EstadoPedido {
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado',
  FABRICACION = 'fabricacion',
  ENVIADO = 'enviado',
  ENTREGADO = 'entregado',
}

/** Materiales disponibles para cotización */
export type MaterialCotizacion = 'pino' | 'roble' | 'nogal' | 'metal' | 'mixto';

/* ------------------------------------------------------------------ */
/*  Core Domain Models                                                */
/* ------------------------------------------------------------------ */

/** Producto base del catálogo */
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  es_personalizable: boolean;
  fecha_creacion: Date;
}

/** Variante de producto (SKU) con atributos dinámicos */
export interface VarianteProducto {
  id: string;
  producto_id: string;
  sku: string;
  atributos: Record<string, unknown>; // {"color":"roble", "alto_cm":120, ...}
  peso_kg: number | null;
  precio_actual: number;
  stock: number;
  tiempo_fabricacion_dias: number;
  activo: boolean;
}

/** Producto con sus variantes (vista enriquecida) */
export interface ProductoConVariantes extends Producto {
  variantes: VarianteProducto[];
}

/** Cliente registrado */
export interface Cliente {
  id: string;
  email: string;
  nombre_completo: string;
  telefono: string | null;
  direccion_envio: string | null;
  password_hash: string;
  auth_proveedor: string;
  fecha_registro: Date;
}

/** DTO para crear/registrar cliente */
export interface ClienteDTO {
  email: string;
  nombre_completo: string;
  telefono?: string;
  direccion_envio?: string;
  password: string;
  auth_proveedor?: string;
}

/** Pedido (venta confirmada) */
export interface Pedido {
  id: string;
  cliente_id: string;
  estado: EstadoPedido;
  subtotal: number;
  costo_envio: number;
  costo_instalacion: number;
  total: number;
  direccion_envio: string;
  zona_envio: string | null;
  factura_electronica_id: string | null;
  fecha_creacion: Date;
}

/** Ítem de un pedido */
export interface PedidoItem {
  id: string;
  pedido_id: string;
  variante_id: string;
  cantidad: number;
  precio_unitario: number;
}

/** Acta de entrega */
export interface ActaEntrega {
  id: string;
  pedido_id: string;
  url_pdf: string;
  contenido_json: Record<string, unknown> | null;
  fecha_generacion: Date;
}

/* ------------------------------------------------------------------ */
/*  Cotizaciones (módulo a medida)                                    */
/* ------------------------------------------------------------------ */

/** Dimensiones para cotización */
export interface Dimensiones {
  alto: number;
  ancho: number;
  profundidad: number;
}

/** Datos del proyecto dentro de la cotización (JSONB) */
export interface DatosProyecto {
  nombre?: string;
  email: string;
  descripcion?: string;
  dimensiones: Dimensiones;
  material: MaterialCotizacion;
  acabados?: string[];
}

/** Solicitud de cotización (body del POST) */
export interface QuoteRequest {
  nombre?: string;
  email: string;
  descripcion?: string;
  dimensiones: Dimensiones;
  material: MaterialCotizacion;
  acabados?: string[];
}

/** Cotización persistida en BD */
export interface Cotizacion {
  id: string;
  cliente_id: string | null;
  email_solicitante: string;
  datos_proyecto: DatosProyecto;
  precio_estimado: number | null;
  pdf_generado: string | null;
  fecha_creacion: Date;
}

/** Datos para generar el PDF de cotización */
export interface QuotePDFData {
  cliente: string;
  email: string;
  descripcion: string;
  dimensiones: Dimensiones;
  material: string;
  acabados: string[];
  precioEstimado: number;
  fecha: string;
}

/* ------------------------------------------------------------------ */
/*  Auth                                                              */
/* ------------------------------------------------------------------ */

/** JWT token payload */
export interface AuthPayload {
  userId: string;
  email: string;
  role: 'admin' | 'staff' | 'cliente';
}

/** Respuesta de autenticación */
export interface AuthResponse {
  token: string;
  user: Omit<Cliente, 'password_hash'>;
}

/* ------------------------------------------------------------------ */
/*  Pagination                                                        */
/* ------------------------------------------------------------------ */

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ------------------------------------------------------------------ */
/*  API Response Envelope                                             */
/* ------------------------------------------------------------------ */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

/* ------------------------------------------------------------------ */
/*  Express extensions                                                */
/* ------------------------------------------------------------------ */

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
