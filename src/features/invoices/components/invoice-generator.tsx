"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buyerProfile } from "@/data/buyer";
import { defaultNotes, defaultTermsAndConditions } from "@/data/invoice-static";
import { createInvoiceAction } from "@/features/invoices/actions/create-invoice";
import { exportInvoicePdfAction } from "@/features/invoices/actions/export-invoice-pdf";
import { InvoiceForm } from "@/features/invoices/components/invoice-form";
import { InvoicePreview } from "@/features/invoices/components/invoice-preview";
import {
  buildInvoiceDocument,
  toInvoiceDocumentInput,
} from "@/features/invoices/utils/build-invoice-document";
import { downloadPdfFromBase64 } from "@/features/invoices/utils/download-pdf";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { DownloadIcon, SaveIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { CreateInvoiceInput } from "../schemas/invoice.schema";

interface InvoiceGeneratorProps {
  initValues?: Partial<CreateInvoiceInput>;
  canSaveDraft: boolean;
}

export function InvoiceGenerator({
  initValues,
  canSaveDraft,
}: InvoiceGeneratorProps) {
  const methods = useForm<CreateInvoiceInput>({
    defaultValues: {
      piNumber: "MMF/001/26",
      issueDate: new Date().toISOString().split("T")[0],
      currency: "USD",
      buyer: buyerProfile,
      notes: defaultNotes,
      termsAndConditions: defaultTermsAndConditions,
      lineItems: [
        {
          description:
            '35% Cotton 65% Polyester TC\nConstruction: 45x45/90x60\nWidth: 55/56"',
          style: "Buyer: MAX DUBAI - B27MCSFEWB250B",
          color: "Navy",
          quantity: 1958,
          unitPrice: 0.7,
          totalPrice: 1370.6,
        },
      ],
      ...initValues,
    },
    mode: "onChange" as const,
  });

  const {
    handleSubmit,
    control,
    getValues,
    formState: { isSubmitting, isDirty },
  } = methods;

  const watchedValues = useWatch({ control });
  const previewData = useMemo(
    () => buildInvoiceDocument(toInvoiceDocumentInput(watchedValues)),
    [watchedValues],
  );

  useUnsavedChanges(isDirty, (event) => {
    event.preventDefault();
    event.returnValue = "";
  });

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [exportStatus, setExportStatus] = useState<
    "idle" | "exporting" | "error"
  >("idle");
  const [persistedInvoiceId, setPersistedInvoiceId] = useState<
    string | undefined
  >();

  const onSave = async (values: CreateInvoiceInput): Promise<void> => {
    setSaveStatus("saving");
    try {
      const result = await createInvoiceAction(values, persistedInvoiceId);
      if (result.ok) {
        setSaveStatus("saved");
        if (result.data.persisted) {
          setPersistedInvoiceId(result.data.invoiceId);
          methods.reset(values);
          toast.success("Draft saved", {
            description: "Your invoice is safely stored.",
          });
        } else {
          toast.info("Invoice is ready", {
            description: "Sign in to save this draft to your account.",
          });
        }
        setTimeout(() => setSaveStatus("idle"), 1500);
      } else {
        setSaveStatus("error");
        toast.error("Couldn’t save draft", { description: result.message });
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    } catch {
      setSaveStatus("error");
      toast.error("Couldn’t save draft", { description: "Please try again." });
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const onExportPdf = async (): Promise<void> => {
    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error("Complete the invoice first", {
        description: "Review the highlighted fields before exporting.",
      });
      return;
    }
    setExportStatus("exporting");
    try {
      const result = await exportInvoicePdfAction(
        getValues(),
        persistedInvoiceId,
      );
      if (!result.ok) {
        setExportStatus("error");
        toast.error("PDF export failed", { description: result.message });
        setTimeout(() => setExportStatus("idle"), 2000);
        return;
      }

      downloadPdfFromBase64(result.data.pdfBase64, result.data.fileName);
      if (result.data.persisted) {
        setPersistedInvoiceId(result.data.invoiceId);
        methods.reset(getValues());
      }
      toast.success("Invoice exported", {
        description: result.data.persisted
          ? "The PDF is downloaded and the invoice is saved to your account."
          : "Your PDF is ready to share.",
      });
      setExportStatus("idle");
    } catch {
      setExportStatus("error");
      toast.error("PDF export failed", { description: "Please try again." });
      setTimeout(() => setExportStatus("idle"), 2000);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-13rem)] grid-cols-1 items-start gap-5 lg:grid-cols-2">
      <div className="min-w-0">
        <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSave)}
                className="flex flex-col gap-6"
              >
                <InvoiceForm />
                <div className="sticky bottom-0 -mx-4 flex flex-wrap justify-end gap-2 border-t border-border/70 bg-card/95 px-4 pb-2 pt-4 backdrop-blur sm:-mx-6 sm:px-6">
                  {canSaveDraft ? (
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      disabled={isSubmitting || saveStatus === "saving"}
                    >
                      <SaveIcon data-icon="inline-start" />
                      {saveStatus === "saving"
                        ? "Saving…"
                        : saveStatus === "saved"
                          ? "Saved"
                          : "Save draft"}
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={exportStatus === "exporting"}
                    onClick={onExportPdf}
                  >
                    <DownloadIcon data-icon="inline-start" />
                    {exportStatus === "exporting" ? "Exporting…" : "Export PDF"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>

      <div className="min-w-0 lg:sticky lg:top-20">
        <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
          <CardContent className="flex flex-col overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border/70 bg-card px-5 py-4">
              <div>
                <p className="text-sm font-semibold">Live preview</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  A4 · Updates as you type
                </p>
              </div>
              <span className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" />{" "}
                Live
              </span>
            </div>
            <div className="min-h-152 overflow-auto bg-muted/40 p-3 sm:p-5">
              <InvoicePreview data={previewData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
