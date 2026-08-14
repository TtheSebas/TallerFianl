/**
 * @fileoverview Express application entry-point for Taller 2.0.
 *
 * Configures:
 *   • CORS, Helmet, Morgan, JSON body parsing
 *   • Global rate limiter
 *   • API routes under /api/v1
 *   • Health-check endpoint at /health
 *   • Global error-handling middleware
 */

import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import apiRouter from './routes';
import { generalLimiter } from './middlewares/rateLimit.middleware';

/* ------------------------------------------------------------------ */
/*  App setup                                                         */
/* ------------------------------------------------------------------ */

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Security headers
app.use(helmet());

// CORS — allow configurable origins or default to all
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Global rate limiter
app.use(generalLimiter);

/* ------------------------------------------------------------------ */
/*  Health check                                                      */
/* ------------------------------------------------------------------ */

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'taller-2.0-server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/* ------------------------------------------------------------------ */
/*  API routes                                                        */
/* ------------------------------------------------------------------ */

app.use('/api/v1', apiRouter);

/* ------------------------------------------------------------------ */
/*  404 handler                                                       */
/* ------------------------------------------------------------------ */

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Recurso no encontrado.',
  });
});

/* ------------------------------------------------------------------ */
/*  Global error handler                                              */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[GlobalErrorHandler]', err);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Error interno del servidor.'
      : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

/* ------------------------------------------------------------------ */
/*  Start server                                                      */
/* ------------------------------------------------------------------ */

app.listen(PORT, () => {
  console.log(`\n🪑  Taller 2.0 server listening on http://localhost:${PORT}`);
  console.log(`   Health check → http://localhost:${PORT}/health`);
  console.log(`   API base     → http://localhost:${PORT}/api/v1\n`);
});

export default app;
