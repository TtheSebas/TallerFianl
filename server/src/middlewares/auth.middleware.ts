/**
 * @fileoverview JWT authentication middleware.
 *
 * Extracts the Bearer token from the `Authorization` header,
 * verifies it with `jsonwebtoken`, and attaches the decoded payload
 * to `req.user` for downstream handlers.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

/**
 * Express middleware that enforces JWT authentication.
 *
 * Responds with 401 if the token is missing or invalid.
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Acceso denegado — token no proporcionado.',
    });
    return;
  }

  const token = header.slice(7); // strip "Bearer "

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (err) {
    const message =
      (err as jwt.TokenExpiredError).name === 'TokenExpiredError'
        ? 'Token expirado — inicia sesión de nuevo.'
        : 'Token inválido.';

    res.status(401).json({ success: false, message });
  }
}
