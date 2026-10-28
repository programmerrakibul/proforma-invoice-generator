"use server";

import { generateInvoicePdfBuffer } from "@/features/invoices/pdf/generate-invoice-pdf";
import {
  createInvoiceSchema,
  type InvoiceFormValues,
} from "@/features/invoices/schemas/invoice.schema";
import { persistInvoice } from "@/features/invoices/services/persist-invoice";
import {
  buildInvoiceDocument,
  toInvoiceDocumentInput,
} from "@/features/invoices/utils/build-invoice-document";
import { requireUser } from "@/lib/auth/require-user";
import { InvoiceModel } from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { isInvoiceCurrency } from "@/config/bank-accounts";
import mongoose from "mongoose";
import type { ActionResult } from "@/lib/validations/action-result";
import { zodErrorToActionResult } from "@/lib/validations/action-result";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

function toSafeFileName(piNumber: string): string {
  const sanitized = piNumber.replace(/[^A-Za-z0-9._-]+/g, "-");
  return sanitized.length > 0 ? sanitized : "draft";
}

export async function exportInvoicePdfAction(
  input: InvoiceFormValues,
  invoiceId?: string,
): Promise<
  ActionResult<{
    fileName: string;
    pdfBase64: string;
    persisted: boolean;
    invoiceId?: string;
  }>
> {
  try {
    const user = await requireUser();
    const validated = createInvoiceSchema.parse(input);
    const documentData = buildInvoiceDocument(
      toInvoiceDocumentInput(validated),
    );
    const pdfBuffer = await generateInvoicePdfBuffer(documentData);
    const fileName = `${toSafeFileName(documentData.piNumber)}.pdf`;
    let persisted = false;
    let savedInvoiceId: string | undefined;

    {
      savedInvoiceId = await persistInvoice(
        user.id,
        validated,
        "exported",
        invoiceId,
      );
      persisted = true;
      revalidatePath("/dashboard/invoices");
      revalidatePath(`/dashboard/invoices/${savedInvoiceId}`);
    }

    return {
      ok: true,
      data: {
        fileName,
        pdfBase64: pdfBuffer.toString("base64"),
        persisted,
        invoiceId: savedInvoiceId,
      },
    };
  } catch (error) {
    console.error("Invoice PDF export failed.", error);
    if (error instanceof ZodError) {
      return zodErrorToActionResult<{
        fileName: string;
        pdfBase64: string;
        persisted: boolean;
        invoiceId?: string;
      }>(error, "Please fix the highlighted fields.");
    }
    return { ok: false, message: "Failed to generate PDF." };
  }
}

export async function exportSavedInvoicePdfAction(invoiceId: string): Promise<
  ActionResult<{
    fileName: string;
    pdfBase64: string;
    persisted: true;
    invoiceId: string;
  }>
> {
  try {
    const user = await requireUser();
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return { ok: false, message: "Invoice not found." };
    }
    await connectToDatabase();

    const invoice = await InvoiceModel.findOne({
      _id: invoiceId,
      ownerId: user.id,
    }).lean();
    if (!invoice) {
      return { ok: false, message: "Invoice not found." };
    }

    const documentData = buildInvoiceDocument({
      piNumber: invoice.piNumber,
      issueDate: invoice.issueDate.toISOString(),
      deliveryDate: invoice.deliveryDate,
      currency: isInvoiceCurrency(invoice.currency) ? invoice.currency : "USD",
      seller: invoice.seller,
      buyer: invoice.buyer,
      lineItems: invoice.lineItems,
      notes: invoice.notes,
      termsAndConditions: invoice.termsAndConditions,
    });
    const pdfBuffer = await generateInvoicePdfBuffer(documentData);
    const updateResult = await InvoiceModel.updateOne(
      { _id: invoice._id, ownerId: user.id },
      { $set: { status: "exported" } },
      { runValidators: true },
    );
    if (updateResult.matchedCount !== 1) {
      return { ok: false, message: "Invoice not found." };
    }

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);

    return {
      ok: true,
      data: {
        fileName: `${toSafeFileName(documentData.piNumber)}.pdf`,
        pdfBase64: pdfBuffer.toString("base64"),
        persisted: true,
        invoiceId,
      },
    };
  } catch (error) {
    console.error("Saved invoice PDF export failed.", error);
    return { ok: false, message: "Failed to generate PDF." };
  }
}
