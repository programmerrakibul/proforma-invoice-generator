"use server";

import { generateInvoicePdfBuffer } from "@/features/invoices/pdf/generate-invoice-pdf";
import {
  buildInvoiceDocument,
  type InvoiceDocumentInput,
} from "@/features/invoices/utils/build-invoice-document";
import type { ActionResult } from "@/lib/validations/action-result";

function toSafeFileName(piNumber: string): string {
  const sanitized = piNumber.replace(/[^A-Za-z0-9._-]+/g, "-");
  return sanitized.length > 0 ? sanitized : "draft";
}

export async function exportInvoicePdfAction(
  input: InvoiceDocumentInput,
): Promise<ActionResult<{ fileName: string; pdfBase64: string }>> {
  try {
    const documentData = buildInvoiceDocument(input);
    const pdfBuffer = await generateInvoicePdfBuffer(documentData);
    const fileName = `proforma-invoice-${toSafeFileName(documentData.piNumber)}.pdf`;

    return {
      ok: true,
      data: {
        fileName,
        pdfBase64: pdfBuffer.toString("base64"),
      },
    };
  } catch {
    return { ok: false, message: "Failed to generate PDF." };
  }
}
