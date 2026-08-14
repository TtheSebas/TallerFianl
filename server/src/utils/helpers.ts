/**
 * @fileoverview Utility / helper functions used across the application.
 */

import { v4 as uuidv4 } from 'uuid';
import { PaginationParams } from '../types';

/**
 * Generate a new UUID v4 identifier.
 * @returns A unique string identifier.
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * Format a numeric amount as a MXN currency string.
 * @param amount - The numeric amount to format.
 * @returns A locale-formatted currency string, e.g. "$1,234.56 MXN".
 */
export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount);

  return `${formatted} MXN`;
}

/**
 * Calculate tax for a given subtotal.
 * @param subtotal - Pre-tax amount.
 * @param rate     - Tax rate as a decimal (default 0.16 = 16 % IVA).
 * @returns The tax amount rounded to two decimal places.
 */
export function calculateTax(subtotal: number, rate = 0.16): number {
  return Math.round(subtotal * rate * 100) / 100;
}

/**
 * Basic input sanitization — strips HTML tags and trims whitespace.
 * Not a replacement for parameterized queries, but useful for logging
 * and display.
 * @param str - The raw input string.
 * @returns Sanitized string.
 */
export function sanitizeInput(str: string): string {
  return str
    .replace(/<[^>]*>/g, '')  // strip HTML tags
    .replace(/[<>"'&]/g, '')  // remove remaining dangerous chars
    .trim();
}

/**
 * Derive safe pagination parameters from raw query-string values.
 * Clamps page ≥ 1 and 1 ≤ limit ≤ 100.
 * @param page  - Requested page (1-indexed).
 * @param limit - Requested page size.
 * @returns Normalised PaginationParams with computed offset.
 */
export function paginate(
  page?: number | string,
  limit?: number | string,
): PaginationParams & { offset: number } {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
  };
}

/**
 * Build a standard ISO-8601 timestamp string for the current moment.
 * @returns Current UTC timestamp.
 */
export function now(): string {
  return new Date().toISOString();
}
