/**
 * @fileoverview PostgreSQL connection pool singleton.
 *
 * Uses environment variables:
 *   DATABASE_URL  — full connection string (preferred), or
 *   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME — individual values.
 */

import { Pool } from 'pg';

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'taller2',
      },
);

export default pool;
