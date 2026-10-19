import Container from "@/components/shared/container";
import { InvoiceGenerator } from "@/features/invoices/components/invoice-generator";
import { companyProfile } from "@/data/company";
import { buyerProfile } from "@/data/buyer";
import { defaultTermsAndConditions, defaultNotes } from "@/data/invoice-static";

export const dynamic = "force-dynamic";

export default function NewInvoicePage() {
  return (
    <Container className="flex h-full flex-col py-4 lg:py-6">
      <div className="mb-4 flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">New Proforma Invoice</h1>
        <p className="text-sm text-muted-foreground">
          Create a proforma invoice with live preview
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <InvoiceGenerator />
      </div>
    </Container>
  );
}