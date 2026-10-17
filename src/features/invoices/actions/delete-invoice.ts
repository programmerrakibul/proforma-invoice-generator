"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/db/mongoose";
import { requireUser } from "@/lib/auth/require-user";
import { InvoiceModel } from "@/lib/db/models";
import { ActionResult } from "@/lib/validations/action-result";

export async function deleteInvoiceAction(
  invoiceId: string,
): Promise<ActionResult<{ invoiceId: string }>> {
  "use server";

  try {
    const user = await requireUser();

    await connectToDatabase();

    // Ownership enforced: query by _id and ownerId together.
    const deleted = await InvoiceModel.findOneAndDelete({
      _id: invoiceId,
      ownerId: user.id,
    });
    if (!deleted) {
      return {
        ok: false,
        message: "Invoice not found or you do not own it.",
      };
    }

    revalidatePath("/dashboard/invoices");

    return {
      ok: true,
      data: { invoiceId },
      message: "Invoice deleted.",
    };
  } catch {
    return { ok: false, message: "Failed to delete invoice." };
  }
}
