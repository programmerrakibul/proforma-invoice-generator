"use server";

import { randomInt } from "node:crypto";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import {
  createInvoiceSchema,
  type InvoiceFormValues,
} from "@/features/invoices/schemas/invoice.schema";
import { persistInvoice } from "@/features/invoices/services/persist-invoice";
import { requireUser } from "@/lib/auth/require-user";
import { ensureGeneratedPiNumberIndex, InvoiceModel } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { isGeneratedPiNumber } from "@/lib/pi-number-format";
import {
  ActionResult,
  zodErrorToActionResult,
} from "@/lib/validations/action-result";

export async function getNextPiNumber(): Promise<string> {
  await requireUser();
  await connectToDatabase();
  await ensureGeneratedPiNumberIndex();
  const date = format(new Date(), "ddMMyy");

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const piNumber = `MMF-${date}-${randomInt(1000, 10000)}`;
    const existing = await InvoiceModel.exists({ piNumber });
    if (!existing) return piNumber;
  }

  throw new Error("Unable to generate a unique invoice number.");
}

export async function createInvoiceAction(
  input: InvoiceFormValues,
  invoiceId?: string,
): Promise<ActionResult<{ invoiceId: string; persisted: true }>> {
  "use server";

  try {
    const validated = createInvoiceSchema.parse(input);
    if (!isGeneratedPiNumber(validated.piNumber)) {
      return {
        ok: false,
        message: "Generate a new invoice number before saving this invoice.",
      };
    }

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
