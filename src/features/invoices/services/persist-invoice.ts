import "server-only";

import type { CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { DEFAULT_SELLER } from "@/features/invoices/utils/build-invoice-document";
import { calculateInvoiceTotals } from "@/features/invoices/utils/calculate-invoice-total";
import { CustomerModel, InvoiceModel } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";

export type PersistedInvoiceStatus = "draft" | "exported";

export async function persistInvoice(
  ownerId: string,
  input: CreateInvoiceInput,
  status: PersistedInvoiceStatus,
  invoiceId?: string,
): Promise<string> {
  await connectToDatabase();
  const totals = calculateInvoiceTotals(input.lineItems);
  const customer = await CustomerModel.findOne({
    _id: input.customerId,
    ownerId,
  }).lean();
  if (!customer) throw new Error("Customer not found.");
  const totalQuantity = totals.lineItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const invoiceValues = {
    ownerId,
    piNumber: input.piNumber,
    issueDate: new Date(input.issueDate),
    currency: input.currency,
    status,
    seller: DEFAULT_SELLER,
    buyerId: customer._id,
    buyer: { name: customer.name, address: customer.address },
    lineItems: totals.lineItems.map((item) => ({
      fabric: item.fabric,
      construction: item.construction,
      width: item.width,
      style: item.style,
      color: item.color,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalAmount: item.totalAmount,
    })),
    subtotal: totals.subtotal,
    totalQuantity,
    totalAmount: totals.totalAmount,
    notes: input.notes,
    termsAndConditions: input.termsAndConditions,
  };

  if (invoiceId) {
    const updatedInvoice = await InvoiceModel.findOneAndUpdate(
      { _id: invoiceId, ownerId },
      { $set: invoiceValues },
      { new: true, runValidators: true },
    );
    if (!updatedInvoice) throw new Error("Invoice not found.");
    return String(updatedInvoice._id);
  }

  const invoice = await InvoiceModel.create(invoiceValues);

  return String(invoice._id);
}
