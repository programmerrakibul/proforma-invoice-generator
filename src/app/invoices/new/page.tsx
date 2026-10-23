import Container from "@/components/shared/container";
import { getNextPiNumber } from "@/features/invoices/actions/create-invoice";
import { InvoiceGenerator } from "@/features/invoices/components/invoice-generator";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  const currentUser = await getCurrentUser();
  const piNumber = currentUser
    ? await getNextPiNumber(currentUser.id)
    : "MMF/001/26";

  return (
    <div className="min-h-screen bg-muted/25">
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
          <InvoiceGenerator
            canSaveDraft={Boolean(currentUser)}
            initValues={{ piNumber }}
          />
        </div>
      </Container>
    </div>
  );
}
