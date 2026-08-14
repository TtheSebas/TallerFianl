/**
 * @fileoverview Repositorio de cotizaciones — acceso a datos para la tabla `cotizaciones`.
 */

import pool from '../config/db';
import { Cotizacion, PaginationParams, PaginatedResult } from '../types';

export class CotizacionRepository {
  /**
   * Crear una nueva cotización.
   */
  async create(data: {
    email_solicitante: string;
    datos_proyecto: Record<string, unknown>;
    precio_estimado: number;
    cliente_id?: string;
  }): Promise<Cotizacion> {
    const result = await pool.query(
      `INSERT INTO cotizaciones (email_solicitante, datos_proyecto, precio_estimado, cliente_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        data.email_solicitante,
        JSON.stringify(data.datos_proyecto),
        data.precio_estimado,
        data.cliente_id || null,
      ],
    );
    return mapRow(result.rows[0]);
  }

  /**
   * Buscar cotización por ID.
   */
  async findById(id: string): Promise<Cotizacion | null> {
    const result = await pool.query('SELECT * FROM cotizaciones WHERE id = $1', [id]);
    return result.rows.length ? mapRow(result.rows[0]) : null;
  }

  /**
   * Listar cotizaciones con paginación.
   */
  async findAll(
    pagination: PaginationParams & { offset: number },
  ): Promise<PaginatedResult<Cotizacion>> {
    const countResult = await pool.query('SELECT COUNT(*) FROM cotizaciones');
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await pool.query(
      `SELECT * FROM cotizaciones
       ORDER BY fecha_creacion DESC
       LIMIT $1 OFFSET $2`,
      [pagination.limit, pagination.offset],
    );

    return {
      data: dataResult.rows.map(mapRow),
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  /**
   * Actualizar la URL del PDF generado.
   */
  async updatePdfUrl(id: string, pdfUrl: string): Promise<Cotizacion | null> {
    const result = await pool.query(
      'UPDATE cotizaciones SET pdf_generado = $1 WHERE id = $2 RETURNING *',
      [pdfUrl, id],
    );
    return result.rows.length ? mapRow(result.rows[0]) : null;
  }
}

/* ------------------------------------------------------------------ */
/*  Row mapper                                                        */
/* ------------------------------------------------------------------ */

function mapRow(row: Record<string, unknown>): Cotizacion {
  return {
    id: row.id as string,
    cliente_id: (row.cliente_id as string) || null,
    email_solicitante: row.email_solicitante as string,
    datos_proyecto:
      typeof row.datos_proyecto === 'string'
        ? JSON.parse(row.datos_proyecto as string)
        : (row.datos_proyecto as Cotizacion['datos_proyecto']),
    precio_estimado: row.precio_estimado ? Number(row.precio_estimado) : null,
    pdf_generado: (row.pdf_generado as string) || null,
    fecha_creacion: new Date(row.fecha_creacion as string),
  };
}
