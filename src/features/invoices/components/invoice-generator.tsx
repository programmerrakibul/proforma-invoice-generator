"use client";

import { TInvoice } from "@/app/dashboard/invoices/edit/[invoiceId]/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { defaultGoods, getDefaultGoodsDetails } from "@/data/goods";
import { defaultTermsAndConditions } from "@/data/terms-and-conditions";
import { createInvoiceAction } from "@/features/invoices/actions/create-invoice";
import { exportInvoicePdfAction } from "@/features/invoices/actions/export-invoice-pdf";
import { InvoiceForm } from "@/features/invoices/components/invoice-form";
import { InvoicePreview } from "@/features/invoices/components/invoice-preview";
import {
  buildInvoiceDocument,
  toInvoiceDocumentInput,
} from "@/features/invoices/utils/build-invoice-document";
import { downloadPdfFromBase64 } from "@/features/invoices/utils/download-pdf";
import { zodResolver } from "@hookform/resolvers/zod";
import { DownloadIcon, SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { updateInvoiceAction } from "../actions/update-invoice";
import {
  createInvoiceSchema,
  type CreateInvoiceInput,
  type InvoiceFormValues,
} from "../schemas/invoice.schema";

type TCustomers = Array<{
  id: string;
  name: string;
  address: string;
  email?: string;
  phone?: string;
}>;

export type InvoiceGeneratorProps =
  | {
      customers: TCustomers;
      piNumber: string;
      update: false;
    }
  | {
      customers: TCustomers;
      update: true;
      invoice: TInvoice;
    };

const buildDefaultInvoiceValues = (
  props: InvoiceGeneratorProps
): CreateInvoiceInput => {
  if (props.update) {
    return {
      piNumber: props.invoice.piNumber,
      issueDate: props.invoice.issueDate.toISOString().split("T")[0],
      currency: props.invoice.currency,
      deliveryDate: props.invoice.deliveryDate,
      customerId: props.invoice.buyerId,
      buyer: props.invoice.buyer,
      notes: props.invoice.notes,
      termsAndConditions: props.invoice.termsAndConditions,
      lineItems: props.invoice.lineItems,
    };
  } else {
    return {
      piNumber: props.piNumber,
      issueDate: new Date().toISOString().split("T")[0],
      currency: "USD",
      deliveryDate: undefined,
      customerId: "",
      buyer: { name: "", address: "" },
      notes: getDefaultGoodsDetails("USD"),
      termsAndConditions: [...defaultTermsAndConditions],
      lineItems: defaultGoods,
    };
  }
};

export function InvoiceGenerator(props: InvoiceGeneratorProps) {
  const { customers, update } = props;
  const router = useRouter();
  const methods = useForm<InvoiceFormValues, undefined, CreateInvoiceInput>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: buildDefaultInvoiceValues(props),
    mode: "onChange" as const,
  });

  const {
    handleSubmit,
    control,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const watchedValues = useWatch({ control });
  const previewData = useMemo(
    () => buildInvoiceDocument(toInvoiceDocumentInput(watchedValues)),
    [watchedValues]
  );

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
      const result = update
        ? await updateInvoiceAction(props.invoice._id, values)
        : await createInvoiceAction(values, persistedInvoiceId);
      if (result.ok) {
        setSaveStatus("saved");

        setPersistedInvoiceId(result.data.invoiceId);
        methods.reset(values);

        toast.success(update ? "Invoice updated" : "Draft saved", {
          description: `Your invoice is safely ${update ? "updated" : "stored"}.`,
        });

        setTimeout(() => setSaveStatus("idle"), 1500);

        router.refresh();
        router.push("/dashboard/invoices");
      } else {
        setSaveStatus("error");
        toast.error(
          `Couldn’t ${update ? "update the invoice" : "save draft"}`,
          { description: result.message }
        );
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    } catch {
      setSaveStatus("error");
      toast.error(`Couldn’t ${update ? "update the invoice" : "save draft"}`, {
        description: "Please try again.",
      });

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
        persistedInvoiceId
      );

      if (!result.ok) {
        setExportStatus("error");
        toast.error("PDF export failed", {
          description: result.message,
        });
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
      router.refresh();
      router.push("/dashboard/invoices");
    } catch {
      setExportStatus("error");
      toast.error("PDF export failed", {
        description: "Please try again.",
      });
      setTimeout(() => setExportStatus("idle"), 2000);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-13rem)] grid-cols-1 items-start gap-5 lg:grid-cols-2">
      <div className="min-w-0">
        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSave)}
                className="flex flex-col gap-6"
              >
                <InvoiceForm customers={customers} />
                <div className="sticky bottom-0 -mx-4 flex flex-wrap justify-end gap-2 border-t border-border/70 bg-card/95 px-4 pb-2 pt-4 backdrop-blur sm:-mx-6 sm:px-6">
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
                        : update
                          ? "Update Invoice"
                          : "Save draft"}
                  </Button>

                  {!update && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={exportStatus === "exporting"}
                      onClick={onExportPdf}
                    >
                      <DownloadIcon data-icon="inline-start" />
                      {exportStatus === "exporting"
                        ? "Exporting…"
                        : "Export PDF"}
                    </Button>
                  )}
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
