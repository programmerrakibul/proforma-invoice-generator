import type { InvoiceCurrency } from "@/config/bank-accounts";

export function formatInvoiceMoney(
  amount: number,
  currency: InvoiceCurrency,
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencyDisplay: "narrowSymbol",
  }).format(amount);
}
