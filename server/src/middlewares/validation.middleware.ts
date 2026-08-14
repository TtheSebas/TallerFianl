/**
 * @fileoverview Lightweight schema-based request-body validation middleware.
 *
 * No external validation library required — schemas are plain objects
 * describing required fields and their expected types.
 *
 * @example
 * ```ts
 * router.post(
 *   '/',
 *   validateBody({
 *     name:  { type: 'string',  required: true  },
 *     price: { type: 'number',  required: true  },
 *     tags:  { type: 'object',  required: false },
 *   }),
 *   controller.create,
 * );
 * ```
 */

import { Request, Response, NextFunction } from 'express';

/** Allowed primitive type names that `typeof` can return. */
type FieldType = 'string' | 'number' | 'boolean' | 'object';

/** Schema entry for a single field. */
export interface FieldRule {
  type: FieldType;
  required: boolean;
  /** Optional minimum length (strings) or minimum value (numbers). */
  min?: number;
  /** Optional maximum length (strings) or maximum value (numbers). */
  max?: number;
}

/** A validation schema is a map of field names to rules. */
export type ValidationSchema = Record<string, FieldRule>;

/**
 * Factory that returns an Express middleware validating `req.body`
 * against the given schema.
 *
 * @param schema - Object describing expected fields.
 * @returns Express middleware function.
 */
export function validateBody(schema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];
    const body = req.body as Record<string, unknown>;

    for (const [field, rule] of Object.entries(schema)) {
      const value = body[field];

      // --- required check ---
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`El campo '${field}' es obligatorio.`);
        continue;
      }

      // Skip optional fields that are absent
      if (value === undefined || value === null) continue;

      // --- type check ---
      if (typeof value !== rule.type) {
        errors.push(
          `El campo '${field}' debe ser de tipo '${rule.type}', se recibió '${typeof value}'.`,
        );
        continue;
      }

      // --- min / max for strings ---
      if (rule.type === 'string' && typeof value === 'string') {
        if (rule.min !== undefined && value.length < rule.min) {
          errors.push(`El campo '${field}' debe tener al menos ${rule.min} caracteres.`);
        }
        if (rule.max !== undefined && value.length > rule.max) {
          errors.push(`El campo '${field}' debe tener como máximo ${rule.max} caracteres.`);
        }
      }

      // --- min / max for numbers ---
      if (rule.type === 'number' && typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          errors.push(`El campo '${field}' debe ser ≥ ${rule.min}.`);
        }
        if (rule.max !== undefined && value > rule.max) {
          errors.push(`El campo '${field}' debe ser ≤ ${rule.max}.`);
        }
      }
    }

    if (errors.length) {
      res.status(400).json({ success: false, message: 'Error de validación.', errors });
      return;
    }

    next();
  };
}
