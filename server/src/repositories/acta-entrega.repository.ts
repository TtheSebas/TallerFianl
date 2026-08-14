/**
 * @fileoverview Repositorio de actas de entrega — acceso a datos
 * para la tabla `actas_entrega`.
 */

import pool from '../config/db';
import { ActaEntrega } from '../types';

export class ActaEntregaRepository {
  /**
   * Crear un acta de entrega.
   */
  async create(data: {
    pedido_id: string;
    url_pdf: string;
    contenido_json?: Record<string, unknown>;
  }): Promise<ActaEntrega> {
    const result = await pool.query(
      `INSERT INTO actas_entrega (pedido_id, url_pdf, contenido_json)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        data.pedido_id,
        data.url_pdf,
        data.contenido_json ? JSON.stringify(data.contenido_json) : null,
      ],
    );
    return mapRow(result.rows[0]);
  }

  /**
   * Buscar actas por pedido ID.
   */
  async findByPedidoId(pedidoId: string): Promise<ActaEntrega[]> {
    const result = await pool.query(
      'SELECT * FROM actas_entrega WHERE pedido_id = $1 ORDER BY fecha_generacion DESC',
      [pedidoId],
    );
    return result.rows.map(mapRow);
  }
}

function mapRow(row: Record<string, unknown>): ActaEntrega {
  return {
    id: row.id as string,
    pedido_id: row.pedido_id as string,
    url_pdf: row.url_pdf as string,
    contenido_json:
      typeof row.contenido_json === 'string'
        ? JSON.parse(row.contenido_json as string)
        : (row.contenido_json as Record<string, unknown>) || null,
    fecha_generacion: new Date(row.fecha_generacion as string),
  };
}
