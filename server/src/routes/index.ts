/**
 * @fileoverview Main API router — mounts all sub-routers under a
 * common prefix so the app only needs a single `app.use('/api/v1', router)`.
 */

import { Router } from 'express';
import productRoutes from './product.routes';
import quoteRoutes from './quote.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/products', productRoutes);
router.use('/quotes', quoteRoutes);
router.use('/auth', authRoutes);

export default router;
