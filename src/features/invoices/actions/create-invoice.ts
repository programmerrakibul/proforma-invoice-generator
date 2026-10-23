"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import {
  createInvoiceSchema,
  type CreateInvoiceInput,
} from "@/features/invoices/schemas/invoice.schema";
import { persistInvoice } from "@/features/invoices/services/persist-invoice";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { InvoiceModel } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import {
  ActionResult,
  zodErrorToActionResult,
} from "@/lib/validations/action-result";

/**
 * Generate a PI number in the format MMF/###/YY (e.g. MMF/001/26)
 * based on the count of existing invoices for the user.
 */
export async function getNextPiNumber(ownerId: string): Promise<string> {
  await connectToDatabase();
  const count = await InvoiceModel.countDocuments({ ownerId });
  const sequence = (count + 1).toString().padStart(3, "0");
  const yy = new Date().getFullYear().toString().slice(-2);
  return `MMF/${sequence}/${yy}`;
}

export async function createInvoiceAction(
  input: CreateInvoiceInput,
  invoiceId?: string,
): Promise<ActionResult<{ invoiceId?: string; persisted: boolean }>> {
  "use server";

  try {
    const validated = createInvoiceSchema.parse(input);

    const user = await getCurrentUser();

    if (user) {
      const savedInvoiceId = await persistInvoice(
        user.id,
        validated,
        "draft",
        invoiceId,
      );

      revalidatePath("/invoices");
      revalidatePath(`/invoices/${savedInvoiceId}`);

      return {
        ok: true,
        data: { invoiceId: savedInvoiceId, persisted: true },
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
