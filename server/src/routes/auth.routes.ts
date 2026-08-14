/**
 * @fileoverview Auth routes — registration, login, and profile.
 *
 * Login / register endpoints are protected by an aggressive rate limiter.
 */

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rateLimit.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { register, login, getMe } from '../controllers/auth.controller';

const router = Router();

/** POST /auth/register — create a new user account. */
router.post(
  '/register',
  authLimiter,
  validateBody({
    email: { type: 'string', required: true },
    password: { type: 'string', required: true, min: 8 },
    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
  }),
  register,
);

/** POST /auth/login — authenticate and receive a JWT. */
router.post(
  '/login',
  authLimiter,
  validateBody({
    email: { type: 'string', required: true },
    password: { type: 'string', required: true },
  }),
  login,
);

/** GET /auth/me — current user profile (auth required). */
router.get('/me', authMiddleware, getMe);

export default router;
