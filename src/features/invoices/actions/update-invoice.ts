"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { connectToDatabase } from "@/lib/db/mongoose";
import { requireUser } from "@/lib/auth/require-user";
import { CustomerModel, InvoiceModel } from "@/lib/db/models";
import {
  ActionResult,
  zodErrorToActionResult,
} from "@/lib/validations/action-result";
import {
  createInvoiceSchema,
  type InvoiceFormValues,
} from "@/features/invoices/schemas/invoice.schema";
import { calculateInvoiceTotals } from "@/features/invoices/utils/calculate-invoice-total";

export async function updateInvoiceAction(
  invoiceId: string,
  input: InvoiceFormValues,
): Promise<ActionResult<{ invoiceId: string }>> {
  "use server";

  try {
    const user = await requireUser();
    const validated = createInvoiceSchema.parse(input);

    await connectToDatabase();

    // Ownership enforced: query by _id and ownerId together.
    const existing = await InvoiceModel.findOne({
      _id: invoiceId,
      ownerId: user.id,
    });
    if (!existing) {
      return {
        ok: false,
        message: "Invoice not found or you do not own it.",
      };
    }
    const customer = await CustomerModel.findOne({
      _id: validated.customerId,
      ownerId: user.id,
    });
    if (!customer) return { ok: false, message: "Customer not found." };

    const updates: Record<string, unknown> = {};

    if (validated.piNumber !== undefined) {
      updates.piNumber = validated.piNumber;
    }
    if (validated.issueDate !== undefined) {
      updates.issueDate = new Date(validated.issueDate);
    }

    const { lineItems, subtotal, totalAmount } = calculateInvoiceTotals(
      validated.lineItems,
    );
    updates.currency = validated.currency;
    if (validated.deliveryDate) {
      updates.deliveryDate = validated.deliveryDate;
    }
    updates.buyerId = customer._id;
    updates.buyer = { name: customer.name, address: customer.address };
    updates.lineItems = lineItems.map((item) => ({
      fabric: item.fabric,
      construction: item.construction,
      width: item.width,
      style: item.style,
      color: item.color,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalAmount: item.totalAmount,
    }));
    updates.subtotal = subtotal;
    updates.totalQuantity = lineItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    updates.totalAmount = totalAmount;
    updates.notes = validated.notes;
    updates.termsAndConditions = validated.termsAndConditions;

    await InvoiceModel.updateOne(
      { _id: invoiceId, ownerId: user.id },
      {
        $set: updates,
        ...(validated.deliveryDate ? {} : { $unset: { deliveryDate: "" } }),
      },
    );

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);

    return {
      ok: true,
      data: { invoiceId },
      message: "Invoice updated.",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToActionResult<{ invoiceId: string }>(
        error,
        "Please fix the highlighted fields.",
      );
    }
    return { ok: false, message: "Failed to update invoice." };
  }
}
