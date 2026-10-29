import type { InvoiceCurrency } from "@/config/bank-accounts";

export type Currency = InvoiceCurrency;
export type InvoiceStatus = "draft" | "ready" | "exported" | "archived";
export type ZoomLevel = "fit" | 75 | 100;
