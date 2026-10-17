"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { connectToDatabase } from "@/lib/db/mongoose";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { InvoiceModel } from "@/lib/db/models";
import { ActionResult, zodErrorToActionResult } from "@/lib/validations/action-result";
import { createInvoiceSchema, type CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { calculateInvoiceTotals } from "@/features/invoices/utils/calculate-invoice-total";

export async function createInvoiceAction(
  input: CreateInvoiceInput,
): Promise<ActionResult<{ invoiceId?: string; persisted: boolean }>> {
  "use server";

  try {
    const validated = createInvoiceSchema.parse(input);

    // Server-calculated totals are authoritative; never trust client totals.
    const { lineItems, subtotal, totalAmount } = calculateInvoiceTotals(
      validated.lineItems,
    );

    const user = await getCurrentUser();

    if (user) {
      await connectToDatabase();

      const invoice = await InvoiceModel.create({
        ownerId: user.id,
        invoiceNumber: validated.invoiceNumber,
        issueDate: new Date(validated.issueDate),
        currency: validated.currency,
        status: "draft",
        seller: validated.seller,
        buyer: validated.buyer,
        lineItems,
        subtotal,
        totalAmount,
        notes: validated.notes,
        termsAndConditions: validated.termsAndConditions,
        signatures: validated.signatures,
      });

      revalidatePath("/dashboard/invoices");
      revalidatePath(`/dashboard/invoices/${invoice._id}`);

      return {
        ok: true,
        data: { invoiceId: String(invoice._id), persisted: true },
        message: "Invoice created.",
      };
    }

    // Guest flow: unauthenticated users can preview/generate PDF client-side,
    // but the invoice is not persisted to MongoDB.
    return {
      ok: true,
      data: { persisted: false },
      message:
        "Invoice prepared for client-side use. Sign in to persist to MongoDB.",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToActionResult<{ invoiceId?: string; persisted: boolean }>(
        error,
        "Please fix the highlighted fields.",
      );
    }
    return { ok: false, message: "Failed to create invoice." };
  }
}
