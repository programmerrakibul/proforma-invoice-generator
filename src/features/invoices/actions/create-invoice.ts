"use server";

import { format } from "date-fns";
import { revalidatePath } from "next/cache";

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
  type ActionResult,
  zodErrorToActionResult,
} from "@/lib/validations/action-result";

export async function getNextPiNumber(): Promise<string> {
  await requireUser();
  await connectToDatabase();
  await ensureGeneratedPiNumberIndex();
  const date = format(new Date(), "yyMM");
  const prefix = `MMF-${date}-`;
  const monthlyInvoiceCount = await InvoiceModel.countDocuments({
    piNumber: { $regex: `^${prefix}` },
  });
  let serialNumber = monthlyInvoiceCount + 1;

  while (true) {
    const piNumber = `${prefix}${String(serialNumber).padStart(3, "0")}`;
    const existing = await InvoiceModel.exists({ piNumber });
    if (!existing) return piNumber;
    serialNumber += 1;
  }
}

export async function createInvoiceAction(
  input: InvoiceFormValues,
  invoiceId?: string
): Promise<ActionResult<{ invoiceId: string; persisted: true }>> {
  const parsed = createInvoiceSchema.safeParse(input);

  if (!parsed.success) {
    return zodErrorToActionResult<{ invoiceId: string; persisted: true }>(
      parsed.error,
      "Please fix the highlighted fields."
    );
  }

  if (!isGeneratedPiNumber(parsed.data.piNumber)) {
    return {
      ok: false,
      message: "Generate a new invoice number before saving this invoice.",
    };
  }

  try {
    const user = await requireUser();
    const savedInvoiceId = await persistInvoice(
      user.id,
      parsed.data,
      "draft",
      invoiceId
    );

    revalidatePath("/dashboard/invoices");

    return {
      ok: true,
      data: { invoiceId: savedInvoiceId, persisted: true },
      message: "Invoice created.",
    };
  } catch (error) {
    console.error("Invoice creation failed.", error);
    return { ok: false, message: "Failed to create invoice." };
  }
}
