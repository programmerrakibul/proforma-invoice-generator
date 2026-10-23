import Container from "@/components/shared/container";
import { InvoiceGenerator } from "@/features/invoices/components/invoice-generator";

export default function NewInvoicePage() {
  return (
    <section className="min-h-screen bg-muted/25">
      <Container className="flex h-full flex-col py-6 lg:py-8">
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Invoice studio
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            New Proforma Invoice
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Shape the details on the left and watch your polished, print-ready
            document come together on the right.
          </p>
        </div>
        <div className="min-h-[calc(100vh-13rem)]">
          <InvoiceGenerator />
        </div>
      </Container>
    </section>
  );
}
