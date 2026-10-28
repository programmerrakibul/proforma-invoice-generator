"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import {
  createInvoiceSchema,
  type InvoiceFormValues,
} from "@/features/invoices/schemas/invoice.schema";
import { persistInvoice } from "@/features/invoices/services/persist-invoice";
import { requireUser } from "@/lib/auth/require-user";
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
export async function getNextPiNumber(): Promise<string> {
  const user = await requireUser();
  await connectToDatabase();
  const count = await InvoiceModel.countDocuments({ ownerId: user.id });
  const sequence = (count + 1).toString().padStart(3, "0");
  const yy = new Date().getFullYear().toString().slice(-2);
  return `MMF/${sequence}/${yy}`;
}

export async function createInvoiceAction(
  input: InvoiceFormValues,
  invoiceId?: string,
): Promise<ActionResult<{ invoiceId: string; persisted: true }>> {
  "use server";

  try {
    const validated = createInvoiceSchema.parse(input);

    const user = await requireUser();
    const savedInvoiceId = await persistInvoice(
      user.id,
      validated,
      "draft",
      invoiceId,
    );

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${savedInvoiceId}`);

    return {
      ok: true,
      data: { invoiceId: savedInvoiceId, persisted: true },
      message: "Invoice created.",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToActionResult<{ invoiceId: string; persisted: true }>(
        error,
        "Please fix the highlighted fields.",
      );
    }
    return { ok: false, message: "Failed to create invoice." };
  }
}
