/**
 * @fileoverview Controlador de productos — maneja peticiones HTTP
 * para el catálogo de muebles.
 */

import { Request, Response } from 'express';
import { ProductoRepository } from '../repositories/product.repository';
import { ApiResponse, Producto, ProductoConVariantes } from '../types';
import { paginate } from '../utils/helpers';

const repo = new ProductoRepository();

/**
 * GET /products
 * Listar productos con filtros opcionales y paginación.
 */
export async function listProducts(req: Request, res: Response): Promise<void> {
  try {
    const pag = paginate(req.query.page as string, req.query.limit as string);
    const filters = {
      categoria: req.query.categoria as string | undefined,
      search: req.query.search as string | undefined,
    };

    const result = await repo.findAll(pag, filters);
    const response: ApiResponse<typeof result> = { success: true, data: result };
    res.json(response);
  } catch (err) {
    console.error('[ProductController] listProducts error:', err);
    res.status(500).json({ success: false, message: 'Error al obtener productos.' });
  }
}

/**
 * GET /products/:id
 * Obtener un producto con sus variantes.
 */
export async function getProduct(req: Request, res: Response): Promise<void> {
  try {
    const product = await repo.findById(req.params.id as string);
    if (!product) {
      res.status(404).json({ success: false, message: 'Producto no encontrado.' });
      return;
    }
    const response: ApiResponse<ProductoConVariantes> = { success: true, data: product };
    res.json(response);
  } catch (err) {
    console.error('[ProductController] getProduct error:', err);
    res.status(500).json({ success: false, message: 'Error al obtener el producto.' });
  }
}

/**
 * POST /products  (auth required)
 * Crear un nuevo producto.
 */
export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, descripcion, categoria, es_personalizable } = req.body;
    if (!nombre) {
      res.status(400).json({ success: false, message: 'El nombre es obligatorio.' });
      return;
    }
    const product = await repo.create({ nombre, descripcion, categoria, es_personalizable });
    const response: ApiResponse<Producto> = { success: true, data: product, message: 'Producto creado.' };
    res.status(201).json(response);
  } catch (err) {
    console.error('[ProductController] createProduct error:', err);
    res.status(500).json({ success: false, message: 'Error al crear el producto.' });
  }
}

/**
 * PUT /products/:id  (auth required)
 * Actualizar un producto existente.
 */
export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const updated = await repo.update(req.params.id as string, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Producto no encontrado.' });
      return;
    }
    const response: ApiResponse<Producto> = { success: true, data: updated, message: 'Producto actualizado.' };
    res.json(response);
  } catch (err) {
    console.error('[ProductController] updateProduct error:', err);
    res.status(500).json({ success: false, message: 'Error al actualizar el producto.' });
  }
}

/**
 * DELETE /products/:id  (auth required)
 * Eliminar un producto.
 */
export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await repo.delete(req.params.id as string);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Producto no encontrado.' });
      return;
    }
    res.json({ success: true, message: 'Producto eliminado.' });
  } catch (err) {
    console.error('[ProductController] deleteProduct error:', err);
    res.status(500).json({ success: false, message: 'Error al eliminar el producto.' });
  }
}
