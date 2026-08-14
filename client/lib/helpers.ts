/**
 * @module lib/helpers
 * Pure utility functions used throughout the Taller 2.0 client.
 * None of these import React, so they work in both server and client contexts.
 */

// ──────────────────────────────────────────────
// Currency formatting
// ──────────────────────────────────────────────

/**
 * Formats a numeric amount as a Mexican Peso (MXN) currency string.
 *
 * @param amount - The price in MXN (integer).
 * @returns A locale-formatted string, e.g. `"$8,500 MXN"`.
 *
 * @example
 * ```ts
 * formatPrice(8500);  // "$8,500 MXN"
 * formatPrice(0);     // "$0 MXN"
 * ```
 */
export function formatPrice(amount: number): string {
  const formatted = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return `${formatted} MXN`;
}

// ──────────────────────────────────────────────
// Text helpers
// ──────────────────────────────────────────────

/**
 * Truncates a string to a maximum length and appends an ellipsis ("…")
 * when the text exceeds that length.  Avoids cutting in the middle of a word.
 *
 * @param text      - The source string.
 * @param maxLength - Maximum character count (default `100`).
 * @returns The (possibly shortened) string.
 *
 * @example
 * ```ts
 * truncateText('Hola mundo cruel', 10); // "Hola mundo…"
 * ```
 */
export function truncateText(text: string, maxLength = 100): string {
  if (text.length <= maxLength) return text;

  // Walk backwards to the nearest space to avoid mid-word breaks.
  let end = maxLength;
  while (end > 0 && text[end] !== ' ') end--;
  if (end === 0) end = maxLength; // no space found — hard cut

  return `${text.slice(0, end).trimEnd()}…`;
}

/**
 * Converts a human-readable string into a URL-safe slug.
 *
 * @param text - The source string (typically a product name).
 * @returns A lowercase, hyphenated slug.
 *
 * @example
 * ```ts
 * slugify('Mesa de Centro Roble'); // "mesa-de-centro-roble"
 * slugify('Silla — Edición Especial!'); // "silla-edicion-especial"
 * ```
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')                     // decompose accented chars
    .replace(/[\u0300-\u036f]/g, '')      // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')         // remove non-alphanumeric
    .replace(/[\s_]+/g, '-')              // collapse whitespace → hyphen
    .replace(/-+/g, '-')                  // collapse consecutive hyphens
    .replace(/^-|-$/g, '');               // trim leading/trailing hyphens
}

// ──────────────────────────────────────────────
// Image helpers
// ──────────────────────────────────────────────

/** Base URL of the backend that serves product images. */
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? 'http://localhost:4000';

/**
 * Resolves a relative image path to a full URL using the configured
 * image base URL.  Absolute URLs are returned unchanged.
 *
 * @param path - Relative path (e.g. `/uploads/mesa.jpg`) or full URL.
 * @returns A fully-qualified URL string.
 *
 * @example
 * ```ts
 * getImageUrl('/uploads/mesa.jpg');
 * // "http://localhost:4000/uploads/mesa.jpg"
 *
 * getImageUrl('https://images.unsplash.com/photo-abc');
 * // "https://images.unsplash.com/photo-abc"
 * ```
 */
export function getImageUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Ensure a single separating slash.
  const base = IMAGE_BASE_URL.replace(/\/+$/, '');
  const segment = path.replace(/^\/+/, '');
  return `${base}/${segment}`;
}

// ──────────────────────────────────────────────
// Validation
// ──────────────────────────────────────────────

/**
 * Validates an email address against a reasonably strict regex.
 *
 * This does **not** guarantee deliverability — only that the string
 * looks syntactically correct.
 *
 * @param email - The email string to test.
 * @returns `true` if the format is valid.
 *
 * @example
 * ```ts
 * validateEmail('user@example.com');  // true
 * validateEmail('not-an-email');      // false
 * ```
 */
export function validateEmail(email: string): boolean {
  // RFC-5322–inspired pattern (simplified).
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return pattern.test(email.trim());
}
