/**
 * @fileoverview Repositorio de pedidos — acceso a datos para las tablas
 * `pedidos` y `pedido_items`.
 */

import pool from '../config/db';
import { Pedido, PedidoItem, EstadoPedido, PaginationParams, PaginatedResult } from '../types';

export class PedidoRepository {
  /**
   * Crear un nuevo pedido con sus ítems.
   */
  async create(
    pedido: Omit<Pedido, 'id' | 'fecha_creacion'>,
    items: Omit<PedidoItem, 'id' | 'pedido_id'>[],
  ): Promise<Pedido> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const pedidoResult = await client.query(
        `INSERT INTO pedidos
           (cliente_id, estado, subtotal, costo_envio, costo_instalacion, total, direccion_envio, zona_envio)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          pedido.cliente_id,
          pedido.estado || EstadoPedido.PENDIENTE,
          pedido.subtotal,
          pedido.costo_envio,
          pedido.costo_instalacion,
          pedido.total,
          pedido.direccion_envio,
          pedido.zona_envio || null,
        ],
      );

      const pedidoId = pedidoResult.rows[0].id;

      for (const item of items) {
        await client.query(
          `INSERT INTO pedido_items (pedido_id, variante_id, cantidad, precio_unitario)
           VALUES ($1, $2, $3, $4)`,
          [pedidoId, item.variante_id, item.cantidad, item.precio_unitario],
        );
      }

      await client.query('COMMIT');
      return mapPedidoRow(pedidoResult.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Obtener un pedido por ID.
   */
  async findById(id: string): Promise<Pedido | null> {
    const result = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
    return result.rows.length ? mapPedidoRow(result.rows[0]) : null;
  }

  /**
   * Obtener los ítems de un pedido.
   */
  async findItemsByPedidoId(pedidoId: string): Promise<PedidoItem[]> {
    const result = await pool.query(
      'SELECT * FROM pedido_items WHERE pedido_id = $1',
      [pedidoId],
    );
    return result.rows.map(mapPedidoItemRow);
  }

  /**
   * Actualizar el estado de un pedido.
   */
  async updateEstado(id: string, estado: EstadoPedido): Promise<Pedido | null> {
    const result = await pool.query(
      'UPDATE pedidos SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id],
    );
    return result.rows.length ? mapPedidoRow(result.rows[0]) : null;
  }

  /**
   * Listar pedidos de un cliente.
   */
  async findByClienteId(
    clienteId: string,
    pagination: PaginationParams & { offset: number },
  ): Promise<PaginatedResult<Pedido>> {
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM pedidos WHERE cliente_id = $1',
      [clienteId],
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await pool.query(
      `SELECT * FROM pedidos WHERE cliente_id = $1
       ORDER BY fecha_creacion DESC
       LIMIT $2 OFFSET $3`,
      [clienteId, pagination.limit, pagination.offset],
    );

    return {
      data: dataResult.rows.map(mapPedidoRow),
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Row mappers                                                       */
/* ------------------------------------------------------------------ */

function mapPedidoRow(row: Record<string, unknown>): Pedido {
  return {
    id: row.id as string,
    cliente_id: row.cliente_id as string,
    estado: row.estado as EstadoPedido,
    subtotal: Number(row.subtotal),
    costo_envio: Number(row.costo_envio),
    costo_instalacion: Number(row.costo_instalacion),
    total: Number(row.total),
    direccion_envio: row.direccion_envio as string,
    zona_envio: (row.zona_envio as string) || null,
    factura_electronica_id: (row.factura_electronica_id as string) || null,
    fecha_creacion: new Date(row.fecha_creacion as string),
  };
}

function mapPedidoItemRow(row: Record<string, unknown>): PedidoItem {
  return {
    id: row.id as string,
    pedido_id: row.pedido_id as string,
    variante_id: row.variante_id as string,
    cantidad: Number(row.cantidad),
    precio_unitario: Number(row.precio_unitario),
  };
}
