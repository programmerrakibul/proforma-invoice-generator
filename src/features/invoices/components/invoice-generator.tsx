"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { useForm, FormProvider, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/toast";
import { createInvoiceSchema, type CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { createInvoiceAction } from "@/features/invoices/actions/create-invoice";
import { InvoiceForm } from "@/features/invoices/components/invoice-form";
import { InvoicePreview } from "@/features/invoices/components/invoice-preview";
import { InvoiceToolbar } from "@/features/invoices/components/invoice-toolbar";
import { setIsDirty, markSaved, setPreviewOpen } from "@/features/invoices/store/invoice-ui.slice";
import { RootState } from "@/store/index";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";

const PdfExportButton = dynamic(
  () =>
    import("@/features/invoices/components/pdf-export-button").then(
      (mod) => mod.PdfExportButton,
    ),
  { ssr: false },
);

type InvoiceFormValues = CreateInvoiceInput;

const DEFAULT_VALUES: InvoiceFormValues = {
  piNumber: "",
  issueDate: "",
  currency: "USD",
  status: "draft",
  seller: { companyName: "", address: "", corporateOffice: "", contactNumber: "", email: "" },
  buyer: { name: "", address: "", destinationCountry: "" },
  lineItems: [],
  subtotal: 0,
  totalAmount: 0,
  notes: {
    sayTotal: "",
    goodsDeliveryDestination: "",
    goodsOrigin: "",
    advisingBank: "",
    allowance: "",
    packing: "",
    shipmentDate: "",
    payment: "",
    partialShipment: "",
    piValidity: "",
  },
  termsAndConditions: [],
  signatures: { buyerLabel: "", sellerLabel: "", stampUrl: "", includeBuyerSignature: false, includeSellerSignature: false },
};

export function InvoiceGenerator({
  initialValues,
  companyProfile,
}: {
  initialValues?: Partial<InvoiceFormValues>;
  companyProfile: InvoiceFormValues["seller"];
}) {
  const dispatch = useDispatch();
  const isPreviewOpen = useSelector((state: RootState) => state.invoiceUi.isPreviewOpen);

  const methods = useForm<CreateInvoiceInput>({
    resolver: (zodResolver(createInvoiceSchema) as unknown) as Resolver<
      CreateInvoiceInput,
      undefined,
      CreateInvoiceInput
    >,
    defaultValues: {
      ...DEFAULT_VALUES,
      ...initialValues,
      seller: companyProfile,
    },
    mode: "onBlur",
    criteriaMode: "all",
  });

  const { handleSubmit, formState: { isSubmitting, isDirty: formIsDirty } } = methods;
  const formValues = methods.getValues();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const onSave = async (values: InvoiceFormValues) => {
    setSaveStatus("saving");
    try {
      const result = await createInvoiceAction(values);
      if (result.ok) {
        setSaveStatus("saved");
        dispatch(markSaved());
        toast.add({ title: "Saved", description: "Invoice draft saved." });
        setTimeout(() => setSaveStatus("idle"), 1500);
      } else {
        setSaveStatus("error");
        toast.add({ title: "Could not save", description: result.message });
      }
    } catch {
      setSaveStatus("error");
      toast.add({ title: "Could not save", description: "An unexpected error occurred." });
    }
  };

  useEffect(() => {
    dispatch(setIsDirty(formIsDirty));
  }, [dispatch, formIsDirty]);

  useUnsavedChanges(
    formIsDirty,
    (event) => {
      event.preventDefault();
    },
  );

  return (
    <div className="flex flex-col h-full">
      <InvoiceToolbar
        isSaving={isSubmitting || saveStatus === "saving"}
        isDirty={formIsDirty}
        isPreviewOpen={isPreviewOpen}
        onSave={() => handleSubmit(onSave)()}
        onTogglePreview={() => dispatch(setPreviewOpen(!isPreviewOpen))}
      />
      <div className="flex-1 min-w-0 overflow-y-auto p-6 lg:p-8">
        {saveStatus === "error" && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>Could not save. Please fix the errors and try again.</AlertDescription>
          </Alert>
        )}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSave)} className="space-y-6">
            <InvoiceForm companyProfile={companyProfile} />
            <div className="flex justify-end gap-3 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={isSubmitting || !formIsDirty}
                onClick={() => handleSubmit(onSave)()}
              >
                <SaveIcon className="size-3.5 mr-2" /> Save draft
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving…" : (<> <SaveIcon className="size-3.5 mr-2" /> Save draft</>)}
              </Button>
              <PdfExportButton
                formValues={formValues}
                isSubmitting={isSubmitting}
                isDirty={formIsDirty}
              />
            </div>
          </form>
        </FormProvider>
      </div>
      {isPreviewOpen && (
        <aside className="lg:w-96 border-l border-border bg-background hidden lg:block flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-xs font-semibold text-ink uppercase tracking-wider">Preview</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <InvoicePreview zoom="fit" />
          </div>
        </aside>
      )}
    </div>
  );
}
