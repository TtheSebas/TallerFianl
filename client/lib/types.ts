/**
 * @module lib/types
 * Shared TypeScript interfaces for the Taller 2.0 application.
 */

// ──────────────────────────────────────────────
// Product
// ──────────────────────────────────────────────

/** Physical dimensions of a furniture piece. */
export interface Dimensions {
  /** Width in centimetres. */
  width: number;
  /** Height in centimetres. */
  height: number;
  /** Depth in centimetres. */
  depth: number;
  /** Human-readable summary, e.g. "120 × 75 × 60 cm". */
  label: string;
}

/** A single furniture product in the catalogue. */
export interface Product {
  /** Unique identifier (UUID or database PK). */
  id: string;
  /** Display name. */
  name: string;
  /** URL-safe slug derived from the name. */
  slug: string;
  /** Full marketing description (may contain line breaks). */
  description: string;
  /** Price in MXN — integer (centavos are not used). */
  price: number;
  /** Ordered list of image URLs; first image is the hero. */
  images: string[];
  /** Product category (e.g. "mesas", "sillas", "libreros"). */
  category: string;
  /** Physical dimensions of the piece. */
  dimensions: Dimensions;
  /** Primary material. */
  material: 'madera' | 'metal' | 'mixto';
  /** Whether the product is currently available for purchase. */
  inStock: boolean;
}

// ──────────────────────────────────────────────
// Quotes
// ──────────────────────────────────────────────

/** Payload sent when a visitor requests a custom furniture quote. */
export interface QuoteRequest {
  /** Full name of the requester. */
  name: string;
  /** Contact email. */
  email: string;
  /** Contact phone number (optional). */
  phone?: string;
  /** Free-text description of the desired piece. */
  description: string;
  /** Preferred material category. */
  preferredMaterial: 'madera' | 'metal' | 'mixto';
  /** Optional estimated budget in MXN. */
  estimatedBudget?: number;
}

/** Server response after a quote has been created or queried. */
export interface QuoteResponse {
  /** Server-assigned quote ID. */
  id: string;
  /** Current status of the quote. */
  status: 'pendiente' | 'en revisión' | 'cotizado' | 'aceptado' | 'rechazado';
  /** Estimated price proposed by the workshop (MXN). */
  estimatedPrice: number | null;
  /** Estimated delivery date as an ISO-8601 string. */
  estimatedDelivery: string | null;
}

// ──────────────────────────────────────────────
// Users
// ──────────────────────────────────────────────

/** Authenticated user profile. */
export interface User {
  /** Unique user ID. */
  id: string;
  /** Display name. */
  name: string;
  /** Login email. */
  email: string;
  /** Authorisation role. */
  role: 'admin' | 'artesano' | 'cliente';
}

// ──────────────────────────────────────────────
// Generic API wrapper
// ──────────────────────────────────────────────

/**
 * Standard envelope returned by every API endpoint.
 *
 * @typeParam T — the shape of the `data` payload on success.
 */
export interface ApiResponse<T> {
  /** Whether the request succeeded. */
  success: boolean;
  /** Payload — only present when `success` is `true`. */
  data: T | null;
  /** Human-readable error message — only present when `success` is `false`. */
  message: string | null;
  /** ISO-8601 timestamp of the response. */
  timestamp: string;
}
