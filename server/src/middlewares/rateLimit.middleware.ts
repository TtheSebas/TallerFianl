/**
 * @fileoverview Rate-limiting middleware configurations using express-rate-limit.
 *
 * Three tiers:
 *   • generalLimiter  — 100 requests per 15-minute window (all endpoints).
 *   • authLimiter     — 5 requests per 15-minute window (login / register).
 *   • quoteLimiter    — 10 requests per 1-hour window (quote creation).
 */

import rateLimit from 'express-rate-limit';

/**
 * General-purpose limiter applied globally.
 * 100 requests per 15 minutes per IP.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,       // 15 minutes
  max: 100,
  standardHeaders: true,           // RateLimit-* headers (draft-6)
  legacyHeaders: false,            // disable X-RateLimit-* headers
  message: {
    success: false,
    message: 'Demasiadas peticiones — intenta de nuevo en unos minutos.',
  },
});

/**
 * Strict limiter for authentication endpoints.
 * 5 requests per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados intentos de autenticación — intenta más tarde.',
  },
});

/**
 * Limiter for quote-creation endpoint.
 * 10 requests per hour per IP.
 */
export const quoteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,       // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Límite de cotizaciones alcanzado — intenta en una hora.',
  },
});
