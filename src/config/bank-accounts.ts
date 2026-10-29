export const INVOICE_CURRENCIES = ["USD", "BDT"] as const;

export type InvoiceCurrency = (typeof INVOICE_CURRENCIES)[number];

export function isInvoiceCurrency(value: string): value is InvoiceCurrency {
  return INVOICE_CURRENCIES.some((currency) => currency === value);
}
