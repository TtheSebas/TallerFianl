'use client';

import { useState, useEffect, useRef } from 'react';
import type { Product, QuoteResponse, ApiResponse } from '@/lib/types';

// ──────────────────────────────────────────────
// useProducts
// ──────────────────────────────────────────────

/** Return type for {@link useProducts}. */
export interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetches the product catalogue from the API.
 *
 * @param category - Optional category slug to filter by.
 * @returns An object containing the product array, loading state, and any error.
 *
 * @example
 * ```tsx
 * const { products, isLoading, error } = useProducts('mesas');
 * ```
 */
export function useProducts(category?: string): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (category) params.set('category', category);

        const url = `/api/products${params.toString() ? `?${params}` : ''}`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const json: ApiResponse<Product[]> = await res.json();

        if (!json.success || !json.data) {
          throw new Error(json.message ?? 'No se pudieron obtener los productos.');
        }

        setProducts(json.data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'Error desconocido.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [category]);

  return { products, isLoading, error };
}

// ──────────────────────────────────────────────
// useQuote
// ──────────────────────────────────────────────

/** Return type for {@link useQuote}. */
export interface UseQuoteResult {
  quote: QuoteResponse | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetches the status of a specific quote.
 *
 * @param id - The quote ID to look up.
 * @returns An object containing the quote data, loading state, and any error.
 *
 * @example
 * ```tsx
 * const { quote, isLoading, error } = useQuote('abc-123');
 * ```
 */
export function useQuote(id: string | undefined): UseQuoteResult {
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function fetchQuote() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/quotes/${id}`, { signal: controller.signal });

        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const json: ApiResponse<QuoteResponse> = await res.json();

        if (!json.success || !json.data) {
          throw new Error(json.message ?? 'No se pudo obtener la cotización.');
        }

        setQuote(json.data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'Error desconocido.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuote();

    return () => controller.abort();
  }, [id]);

  return { quote, isLoading, error };
}

// ──────────────────────────────────────────────
// useDebounce
// ──────────────────────────────────────────────

/**
 * Debounces a rapidly-changing value.
 *
 * Returns a copy of `value` that only updates after `delay` ms of
 * inactivity.  Useful for search inputs that trigger API calls.
 *
 * @param value - The value to debounce.
 * @param delay - Debounce window in milliseconds (default `300`).
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebounce(query, 400);
 *
 * useEffect(() => {
 *   // fires only after 400 ms of no typing
 *   search(debouncedQuery);
 * }, [debouncedQuery]);
 * ```
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
}
