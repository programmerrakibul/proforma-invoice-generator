import Container from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvoiceListLoading() {
  return (
    <section className="py-10 lg:py-14" aria-busy="true" aria-label="Loading invoices">
      <Container className="overflow-visible">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-44 max-w-full" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>

        <div className="mb-5 grid gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm md:grid-cols-[minmax(16rem,1fr)_12rem_12rem_auto]">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <div className="hidden grid-cols-5 gap-4 border-b border-border/70 bg-muted/40 px-5 py-4 md:grid">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16 justify-self-end" />
          </div>
          <div className="divide-y divide-border/70">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="grid gap-3 px-5 py-4 md:grid-cols-5 md:items-center md:gap-4"
              >
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-32 max-w-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-24 justify-self-start md:justify-self-end" />
              </div>
            ))}
          </div>
        </div>
        <span className="sr-only">Loading your invoice workspace.</span>
      </Container>
    </section>
  );
}
