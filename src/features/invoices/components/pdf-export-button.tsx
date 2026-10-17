"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

const InvoicePdfDocument = dynamic(
  () =>
    import("@/features/invoices/components/invoice-pdf").then(
      (mod) => mod.InvoicePdfDocument,
    ),
  { ssr: false },
);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PdfDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false },
) as any;

interface PdfExportButtonProps {
  formValues: {
    piNumber?: string;
    issueDate?: string;
    currency?: string;
    seller?: any;
    buyer?: any;
    lineItems?: any[];
    subtotal?: number;
    totalAmount?: number;
    notes?: any;
    termsAndConditions?: string[];
    signatures?: any;
  };
  isSubmitting: boolean;
  isDirty: boolean;
}

export function PdfExportButton({ formValues, isSubmitting, isDirty }: PdfExportButtonProps) {
  return (
    <PdfDownloadLink
      document={
        <InvoicePdfDocument
          piNumber={formValues.piNumber}
          issueDate={formValues.issueDate}
          currency={formValues.currency}
          seller={formValues.seller}
          buyer={formValues.buyer}
          lineItems={formValues.lineItems}
          subtotal={formValues.subtotal}
          totalAmount={formValues.totalAmount}
          notes={formValues.notes}
          termsAndConditions={formValues.termsAndConditions}
          signatures={formValues.signatures}
        />
      }
      fileName={`proforma-invoice-${formValues.piNumber}.pdf`}
    >
      {({ loading, error }: any) => {
        if (error) {
          console.error("PDF export error:", error);
        }
        return (
          <Button
            variant="outline"
            disabled={isSubmitting || !isDirty || loading}
          >
            {loading ? (
              <>
                <DownloadIcon className="size-3.5 mr-2 animate-spin" /> Exporting…
              </>
            ) : (
              <>
                <DownloadIcon className="size-3.5 mr-2" /> Export PDF
              </>
            )}
          </Button>
        );
      }}
    </PdfDownloadLink>
  );
}
