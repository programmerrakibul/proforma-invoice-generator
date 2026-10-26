"use server";

import { generateInvoicePdfBuffer } from "@/features/invoices/pdf/generate-invoice-pdf";
import {
  createInvoiceSchema,
  type CreateInvoiceInput,
} from "@/features/invoices/schemas/invoice.schema";
import { persistInvoice } from "@/features/invoices/services/persist-invoice";
import {
  buildInvoiceDocument,
  toInvoiceDocumentInput,
} from "@/features/invoices/utils/build-invoice-document";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import type { ActionResult } from "@/lib/validations/action-result";
import { zodErrorToActionResult } from "@/lib/validations/action-result";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

function toSafeFileName(piNumber: string): string {
  const sanitized = piNumber.replace(/[^A-Za-z0-9._-]+/g, "-");
  return sanitized.length > 0 ? sanitized : "draft";
}

export async function exportInvoicePdfAction(
  input: CreateInvoiceInput,
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
    const validated = createInvoiceSchema.parse(input);
    const documentData = buildInvoiceDocument(
      toInvoiceDocumentInput(validated),
    );
    const pdfBuffer = await generateInvoicePdfBuffer(documentData);
    const fileName = `${toSafeFileName(documentData.piNumber)}.pdf`;
    const user = await getCurrentUser();
    let persisted = false;
    let savedInvoiceId: string | undefined;

    if (user) {
      savedInvoiceId = await persistInvoice(
        user.id,
        validated,
        "exported",
        invoiceId,
      );
      persisted = true;
      revalidatePath("/invoices");
      revalidatePath(`/invoices/${savedInvoiceId}`);
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
