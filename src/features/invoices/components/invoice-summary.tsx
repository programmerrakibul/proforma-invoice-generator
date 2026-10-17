"use client";

import { useFormContext } from "react-hook-form";
import { type CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";

type InvoiceFormValues = CreateInvoiceInput;

export function InvoiceSummary() {
  const { getValues } = useFormContext<InvoiceFormValues>();
  const formValues = getValues();

  const currency = formValues.currency ?? "USD";
  const subtotal = Number(formValues.subtotal ?? 0);
  const totalAmount = Number(formValues.totalAmount ?? 0);

  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-xs text-muted-foreground">Subtotal</span>
        <span className="text-xs font-medium">{`${currency} ${subtotal.toFixed(2)}`}</span>
      </div>
      <div className="flex items-center justify-between pt-2 text-sm font-medium">
        <span>Total</span>
        <span>{`${currency} ${totalAmount.toFixed(2)}`}</span>
      </div>
    </div>
  );
}
