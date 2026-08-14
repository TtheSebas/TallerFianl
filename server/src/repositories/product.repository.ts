/**
 * @fileoverview Repositorio de productos — acceso a datos para las tablas
 * `productos` y `variantes_producto`.
 */

import pool from '../config/db';
import { Producto, VarianteProducto, ProductoConVariantes, PaginationParams, PaginatedResult } from '../types';

export class ProductoRepository {
  /**
   * Listar productos con paginación y filtros opcionales.
   */
  async findAll(
    pagination: PaginationParams & { offset: number },
    filters?: { categoria?: string; search?: string },
  ): Promise<PaginatedResult<Producto>> {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (filters?.categoria) {
      conditions.push(`categoria = $${idx++}`);
      values.push(filters.categoria);
    }
    if (filters?.search) {
      conditions.push(`(nombre ILIKE $${idx} OR descripcion ILIKE $${idx})`);
      values.push(`%${filters.search}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM productos ${where}`,
      values,
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await pool.query(
      `SELECT * FROM productos ${where}
       ORDER BY fecha_creacion DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, pagination.limit, pagination.offset],
    );

    return {
      data: dataResult.rows.map(mapProductoRow),
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  /**
   * Obtener un producto con sus variantes.
   */
  async findById(id: string): Promise<ProductoConVariantes | null> {
    const prodResult = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (!prodResult.rows.length) return null;

    const varResult = await pool.query(
      'SELECT * FROM variantes_producto WHERE producto_id = $1 AND activo = true',
      [id],
    );

    return {
      ...mapProductoRow(prodResult.rows[0]),
      variantes: varResult.rows.map(mapVarianteRow),
    };
  }

  /**
   * Crear un nuevo producto.
   */
  async create(data: {
    nombre: string;
    descripcion?: string;
    categoria?: string;
    es_personalizable?: boolean;
  }): Promise<Producto> {
    const result = await pool.query(
      `INSERT INTO productos (nombre, descripcion, categoria, es_personalizable)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        data.nombre,
        data.descripcion || null,
        data.categoria || null,
        data.es_personalizable ?? false,
      ],
    );
    return mapProductoRow(result.rows[0]);
  }

  /**
   * Actualizar un producto existente.
   */
  async update(id: string, data: Partial<Producto>): Promise<Producto | null> {
    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.nombre !== undefined) { sets.push(`nombre = $${idx++}`); values.push(data.nombre); }
    if (data.descripcion !== undefined) { sets.push(`descripcion = $${idx++}`); values.push(data.descripcion); }
    if (data.categoria !== undefined) { sets.push(`categoria = $${idx++}`); values.push(data.categoria); }
    if (data.es_personalizable !== undefined) { sets.push(`es_personalizable = $${idx++}`); values.push(data.es_personalizable); }

    if (sets.length === 0) return null;
    values.push(id);

    const result = await pool.query(
      `UPDATE productos SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    );
    return result.rows.length ? mapProductoRow(result.rows[0]) : null;
  }

  /**
   * Eliminar un producto (cascade elimina variantes).
   */
  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

/* ------------------------------------------------------------------ */
/*  Repositorio de variantes                                          */
/* ------------------------------------------------------------------ */

export class VarianteRepository {
  /**
   * Crear una variante para un producto.
   */
  async create(data: Omit<VarianteProducto, 'id'>): Promise<VarianteProducto> {
    const result = await pool.query(
      `INSERT INTO variantes_producto
         (producto_id, sku, atributos, peso_kg, precio_actual, stock, tiempo_fabricacion_dias, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.producto_id,
        data.sku,
        JSON.stringify(data.atributos),
        data.peso_kg,
        data.precio_actual,
        data.stock,
        data.tiempo_fabricacion_dias,
        data.activo ?? true,
      ],
    );
    return mapVarianteRow(result.rows[0]);
  }

  /**
   * Actualizar stock de una variante.
   */
  async updateStock(id: string, stock: number): Promise<VarianteProducto | null> {
    const result = await pool.query(
      'UPDATE variantes_producto SET stock = $1 WHERE id = $2 RETURNING *',
      [stock, id],
    );
    return result.rows.length ? mapVarianteRow(result.rows[0]) : null;
  }

  /**
   * Buscar variante por SKU.
   */
  async findBySku(sku: string): Promise<VarianteProducto | null> {
    const result = await pool.query(
      'SELECT * FROM variantes_producto WHERE sku = $1',
      [sku],
    );
    return result.rows.length ? mapVarianteRow(result.rows[0]) : null;
  }
}

/* ------------------------------------------------------------------ */
/*  Row mappers                                                       */
/* ------------------------------------------------------------------ */

function mapProductoRow(row: Record<string, unknown>): Producto {
  return {
    id: row.id as string,
    nombre: row.nombre as string,
    descripcion: (row.descripcion as string) || null,
    categoria: (row.categoria as string) || null,
    es_personalizable: row.es_personalizable as boolean,
    fecha_creacion: new Date(row.fecha_creacion as string),
  };
}

function mapVarianteRow(row: Record<string, unknown>): VarianteProducto {
  return {
    id: row.id as string,
    producto_id: row.producto_id as string,
    sku: row.sku as string,
    atributos:
      typeof row.atributos === 'string'
        ? JSON.parse(row.atributos as string)
        : (row.atributos as Record<string, unknown>),
    peso_kg: row.peso_kg ? Number(row.peso_kg) : null,
    precio_actual: Number(row.precio_actual),
    stock: Number(row.stock),
    tiempo_fabricacion_dias: Number(row.tiempo_fabricacion_dias),
    activo: row.activo as boolean,
  };
}
