"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createInvoiceAction } from "@/features/invoices/actions/create-invoice";
import { InvoiceForm } from "@/features/invoices/components/invoice-form";
import { SaveIcon } from "lucide-react";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { CreateInvoiceInput } from "../schemas/invoice.schema";

const InvoicePdfDocument = dynamic(
  () =>
    import("@/features/invoices/components/invoice-pdf").then(
      (mod) => mod.InvoicePdfDocument,
    ),
  { ssr: false },
);

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false },
);

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false },
);

interface InvoiceGeneratorProps {
  initValues?: Partial<CreateInvoiceInput>;
}

export function InvoiceGenerator({
  initValues,
}: InvoiceGeneratorProps) {
  const methods = useForm<CreateInvoiceInput>({
    defaultValues: initValues ?? {
      piNumber: "",
      issueDate: new Date().toISOString().split("T")[0],
    },
    mode: "onChange" as const,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods

  useUnsavedChanges(isDirty, (event) => {
    event.preventDefault();
    event.returnValue = "";
  });

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const onSave = async (values: CreateInvoiceInput) => {


    console.log("Saving values:", values);
    return

    setSaveStatus("saving");
    try {
      const result = await createInvoiceAction(values);
      if (result.ok) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 1500);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  // const pdfDocument = (
  //   <InvoicePdfDocument
  //     piNumber={formValues.piNumber || "PI-XXXX-001"}
  //     issueDate={formValues.issueDate}
  //     currency={formValues.currency}
  //     seller={formValues.seller}
  //     buyer={formValues.buyer}
  //     lineItems={formValues.lineItems}
  //     subtotal={formValues.subtotal ?? 0}
  //     totalAmount={formValues.totalAmount ?? 0}
  //     notes={formValues.notes}
  //     termsAndConditions={formValues.termsAndConditions}
  //     signatures={formValues.signatures}
  //   />
  // );

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
      <div className="flex h-full w-full flex-col overflow-hidden lg:w-1/2">
        <Card className="flex h-full flex-col overflow-hidden">
          <CardContent className="flex flex-1 flex-col overflow-y-auto p-6">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSave)} className="space-y-6">
                <InvoiceForm />
                <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-6">
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting || saveStatus === "saving"}
                  >
                    <SaveIcon className="mr-2 size-3.5" />
                    {saveStatus === "saving" ? "Saving..." : "Save Draft"}
                  </Button>
                  {/* <PDFDownloadLink
                    document={pdfDocument}
                    fileName={`proforma-invoice-${formValues.piNumber || "draft"}.pdf`}
                  >
                    {({ loading }: { loading: boolean }) => (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={loading}
                      >
                        <SaveIcon className="mr-2 size-3.5" />
                        {loading ? "Exporting..." : "Export PDF"}
                      </Button>
                    )}
                  </PDFDownloadLink> */}
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>

      <div className="flex h-full w-full flex-col lg:w-1/2">
        <Card className="flex h-full flex-col overflow-hidden">
          <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
            <div className="flex h-full min-h-150 w-full flex-col">
              {/* <PDFViewer className="h-full w-full border-0">
                {pdfDocument}
              </PDFViewer> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
