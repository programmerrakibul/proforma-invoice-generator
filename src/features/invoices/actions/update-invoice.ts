"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { connectToDatabase } from "@/lib/db/mongoose";
import { requireUser } from "@/lib/auth/require-user";
import { InvoiceModel } from "@/lib/db/models";
import { ActionResult, zodErrorToActionResult } from "@/lib/validations/action-result";
import { updateInvoiceSchema, type UpdateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { calculateInvoiceTotals } from "@/features/invoices/utils/calculate-invoice-total";

export async function updateInvoiceAction(
  invoiceId: string,
  input: UpdateInvoiceInput,
): Promise<ActionResult<{ invoiceId: string }>> {
  "use server";

  try {
    const user = await requireUser();
    const validated = updateInvoiceSchema.parse(input);

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

    const updates: Record<string, unknown> = {};

    if (validated.invoiceNumber !== undefined) {
      updates.invoiceNumber = validated.invoiceNumber;
    }
    if (validated.issueDate !== undefined) {
      updates.issueDate = new Date(validated.issueDate);
    }
    if (validated.currency !== undefined) {
      updates.currency = validated.currency;
    }
    if (validated.status !== undefined) {
      updates.status = validated.status;
    }
    if (validated.seller !== undefined) {
      updates.seller = validated.seller;
    }
    if (validated.buyer !== undefined) {
      updates.buyer = validated.buyer;
    }
    if (validated.notes !== undefined) {
      updates.notes = validated.notes;
    }
    if (validated.termsAndConditions !== undefined) {
      updates.termsAndConditions = validated.termsAndConditions;
    }
    if (validated.signatures !== undefined) {
      updates.signatures = validated.signatures;
    }

    // Recalculate totals server-side when line items change.
    if (validated.lineItems !== undefined) {
      if (validated.lineItems.length === 0) {
        return {
          ok: false,
          message: "Add at least one product.",
          fieldErrors: {
            lineItems: ["Add at least one product."],
          },
        };
      }
      const { lineItems, subtotal, totalAmount } = calculateInvoiceTotals(
        validated.lineItems,
      );
      updates.lineItems = lineItems;
      updates.subtotal = subtotal;
      updates.totalAmount = totalAmount;
    }

    await InvoiceModel.updateOne({ _id: invoiceId, ownerId: user.id }, updates);

    revalidatePath("/invoices");
    revalidatePath(`/invoices/${invoiceId}`);

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
