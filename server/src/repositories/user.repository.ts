/**
 * @fileoverview Repositorio de clientes — acceso a datos para la tabla `clientes`.
 */

import pool from '../config/db';
import { Cliente } from '../types';

export class ClienteRepository {
  /**
   * Buscar cliente por email (case-insensitive).
   */
  async findByEmail(email: string): Promise<Cliente | null> {
    const result = await pool.query(
      'SELECT * FROM clientes WHERE LOWER(email) = LOWER($1)',
      [email],
    );
    return result.rows.length ? mapRow(result.rows[0]) : null;
  }

  /**
   * Buscar cliente por ID.
   */
  async findById(id: string): Promise<Cliente | null> {
    const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    return result.rows.length ? mapRow(result.rows[0]) : null;
  }

  /**
   * Crear un nuevo cliente.
   */
  async create(data: {
    email: string;
    nombre_completo: string;
    telefono?: string;
    direccion_envio?: string;
    password_hash: string;
    auth_proveedor?: string;
  }): Promise<Cliente> {
    const result = await pool.query(
      `INSERT INTO clientes (email, nombre_completo, telefono, direccion_envio, password_hash, auth_proveedor)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.email,
        data.nombre_completo,
        data.telefono || null,
        data.direccion_envio || null,
        data.password_hash,
        data.auth_proveedor || 'local',
      ],
    );
    return mapRow(result.rows[0]);
  }
}

/* ------------------------------------------------------------------ */
/*  Row mapper                                                        */
/* ------------------------------------------------------------------ */

function mapRow(row: Record<string, unknown>): Cliente {
  return {
    id: row.id as string,
    email: row.email as string,
    nombre_completo: row.nombre_completo as string,
    telefono: (row.telefono as string) || null,
    direccion_envio: (row.direccion_envio as string) || null,
    password_hash: row.password_hash as string,
    auth_proveedor: (row.auth_proveedor as string) || 'local',
    fecha_registro: new Date(row.fecha_registro as string),
  };
}
