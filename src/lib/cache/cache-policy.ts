/**
 * Cache policy for the invoice feature.
 *
 * Rules:
 * - Server reads (invoice list, detail) may be wrapped in unstable_cache
 *   only when the cache key/tag includes the authenticated user id.
 * - Mutations (create/update/delete) must never be wrapped in unstable_cache.
 * - After a mutation, revalidate the affected paths and/or tags so the next
 *   server read fetches fresh data.
 * - Never cache passwordHash or other sensitive fields.
 */
export const CACHE = {
  // Seconds an invoice list read may stay cached before revalidation.
  invoiceListRevalidate: 60,
  // Seconds a single invoice detail read may stay cached before revalidation.
  invoiceDetailRevalidate: 60,
} as const;
