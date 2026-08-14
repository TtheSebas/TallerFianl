/**
 * @fileoverview Rutas de cotizaciones.
 */

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { quoteLimiter } from '../middlewares/rateLimit.middleware';
import {
  createQuote,
  getQuoteById,
  listQuotes,
} from '../controllers/quote.controller';

const router = Router();

router.post('/', quoteLimiter, createQuote);
router.get('/:id', getQuoteById);
router.get('/', authMiddleware, listQuotes);

export default router;
