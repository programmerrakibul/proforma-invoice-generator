import "server-only";

import { getDefaultGoodsDetails } from "@/data/goods";
import type { CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { DEFAULT_SELLER } from "@/features/invoices/utils/build-invoice-document";
import {
  CustomerModel,
  ensureGeneratedPiNumberIndex,
  InvoiceModel,
} from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { isGeneratedPiNumber } from "@/lib/pi-number-format";

export type PersistedInvoiceStatus = "draft" | "exported";

export async function persistInvoice(
  ownerId: string,
  input: CreateInvoiceInput,
  status: PersistedInvoiceStatus,
  invoiceId?: string,
): Promise<string> {
  await connectToDatabase();

  if (isGeneratedPiNumber(input.piNumber)) {
    await ensureGeneratedPiNumberIndex();
  }

  const existingInvoice = invoiceId
    ? await InvoiceModel.findOne({ _id: invoiceId, ownerId }).select("piNumber")
    : null;

  if (invoiceId && !existingInvoice) throw new Error("Invoice not found.");

  if (
    !isGeneratedPiNumber(input.piNumber) &&
    (!existingInvoice || existingInvoice.piNumber !== input.piNumber)
  ) {
    throw new Error("A valid unique invoice number is required.");
  }

  const customer = await CustomerModel.findOne({
    _id: input.customerId,
  }).lean();

  if (!customer) throw new Error("Customer not found.");

  const notes = input.notes;
  const destinationIndex = notes.findIndex(
    (note) => note.key === "goodsDeliveryDestination",
  );

  if (destinationIndex >= 0) {
    notes[destinationIndex].value = customer.name;
  } else {
    const destination = getDefaultGoodsDetails(input.currency).find(
      (note) => note.key === "goodsDeliveryDestination",
    );

    if (destination) {
      notes.unshift({ ...destination, value: customer.name });
    }
  }

  const invoiceValues = {
    ...input,
    ownerId,
    ...(isGeneratedPiNumber(input.piNumber) ? { piNumberVersion: 2 } : {}),
    issueDate: new Date(input.issueDate),
    ...(input.deliveryDate ? { deliveryDate: input.deliveryDate } : {}),
    status,
    seller: DEFAULT_SELLER,
    buyerId: customer._id,
    buyer: { name: customer.name, address: customer.address },
    notes,
    termsAndConditions:
      input.currency === "BDT" ? [] : input.termsAndConditions,
  };

  if (invoiceId) {
    const updatedInvoice = await InvoiceModel.findOneAndUpdate(
      { _id: invoiceId, ownerId, piNumber: input.piNumber },
      {
        $set: invoiceValues,
        ...(input.deliveryDate ? {} : { $unset: { deliveryDate: "" } }),
      },
      { new: true, runValidators: true },
    );

    if (!updatedInvoice) throw new Error("Invoice not found.");

    return String(updatedInvoice._id);
  }

  const invoice = await InvoiceModel.create(invoiceValues);

  console.log(invoice);

  return String(invoice._id);
}
