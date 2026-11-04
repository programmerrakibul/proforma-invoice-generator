import Container from "@/components/shared/container";
import { getCustomersForInvoiceAction } from "@/features/customers/actions/customer-actions";
import { getInvoiceByIdAction } from "@/features/invoices/actions/get-invoice-by-id";
import { InvoiceGenerator } from "@/features/invoices/components/invoice-generator";
import { notFound } from "next/navigation";

interface UpdateInvoicePageProps {
  params: Promise<{
    invoiceId: string;
  }>;
}

export type TInvoice = Required<
  Awaited<ReturnType<typeof getInvoiceByIdAction>>
>["data"];

const UpdateInvoicePage = async ({ params }: UpdateInvoicePageProps) => {
  const { invoiceId } = await params;
  const [data, result] = await Promise.all([
    getInvoiceByIdAction(invoiceId),
    getCustomersForInvoiceAction(),
  ]);

  if (!data.ok) {
    notFound();
  }

  return (
    <section className="min-h-screen bg-muted/25">
      <Container className="flex h-full flex-col py-6 lg:py-8">
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Invoice studio
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Update Proforma Invoice
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Update your invoice details and make any necessary changes before
            finalizing the document.
          </p>
        </div>
        <div className="min-h-[calc(100vh-13rem)]">
          <InvoiceGenerator
            update={true}
            customers={result.ok ? result.data : []}
            invoice={data.data as TInvoice}
          />
        </div>
      </Container>
    </section>
  );
};

export default UpdateInvoicePage;
