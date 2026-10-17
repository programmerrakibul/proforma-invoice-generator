/**
 * Cache tags for user-scoped invoice data.
 *
 * These tags are used with Next.js cache invalidation (revalidateTag /
 * unstable_cache) so that invoice reads stay consistent with mutations.
 * Each tag includes the authenticated user id so private invoice data is
 * never shared across users.
 */
export function userInvoicesTag(userId: string): string {
  return `user:${userId}:invoices`;
}

export function userInvoiceTag(userId: string, invoiceId: string): string {
  return `user:${userId}:invoice:${invoiceId}`;
}

export const invoiceListTag = "invoices:list";
