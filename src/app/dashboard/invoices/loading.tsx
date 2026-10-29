import Container from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvoiceListLoading() {
  return (
    <section
      className="py-10 lg:py-14"
      aria-busy="true"
      aria-label="Loading invoices"
    >
      <Container className="overflow-visible">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-44 max-w-full" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm md:grid-cols-[minmax(16rem,1fr)_12rem_12rem_auto]">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
        </div>

        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <div className="min-w-5xl">
              <div className="grid grid-cols-[1.05fr_1.3fr_1fr_0.8fr_1fr_1.1fr_1.1fr_1fr] gap-4 border-b border-border/70 bg-muted/40 px-4 py-3">
                {[
                  "w-16",
                  "w-24",
                  "w-16",
                  "w-12",
                  "w-20",
                  "w-20",
                  "w-20",
                  "w-14",
                ].map((width, index) => (
                  <Skeleton
                    key={index}
                    className={`h-3 ${width} ${index > 3 ? "justify-self-end" : ""}`}
                  />
                ))}
              </div>
              <div className="divide-y divide-border/70">
                {Array.from({ length: 6 }, (_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-[1.05fr_1.3fr_1fr_0.8fr_1fr_1.1fr_1.1fr_1fr] items-center gap-4 px-4 py-4"
                  >
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-4 w-14 justify-self-end" />
                    <Skeleton className="h-4 w-16 justify-self-end" />
                    <Skeleton className="h-4 w-20 justify-self-end" />
                    <div className="flex justify-end gap-1">
                      <Skeleton className="size-7 rounded-md" />
                      <Skeleton className="size-7 rounded-md" />
                      <Skeleton className="size-7 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <span className="sr-only">Loading your invoice workspace.</span>
      </Container>
    </section>
  );
}
