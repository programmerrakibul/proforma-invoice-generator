import Container from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewInvoiceLoading() {
  return (
    <section className="py-8 lg:py-12" aria-busy="true" aria-label="Loading invoice studio">
      <Container className="overflow-visible">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-9 w-52 max-w-full" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
          <div className="flex flex-col gap-5">
            {["Seller and buyer", "Invoice details", "Line items"].map((section) => (
              <div key={section} className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-3 w-48 max-w-full" />
                  </div>
                  <Skeleton className="size-8 rounded-lg" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-10 rounded-lg" />
                  <Skeleton className="h-10 rounded-lg" />
                  <Skeleton className="h-10 rounded-lg sm:col-span-2" />
                  {section === "Line items" ? (
                    <>
                      <Skeleton className="h-10 rounded-lg sm:col-span-2" />
                      <Skeleton className="h-10 rounded-lg" />
                      <Skeleton className="h-10 rounded-lg" />
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <aside className="xl:sticky xl:top-24 xl:self-start" aria-label="Invoice preview loading">
            <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
              <div className="mx-auto flex min-h-[30rem] max-w-[34rem] flex-col border border-border/70 bg-background p-6 shadow-sm sm:p-8">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <Skeleton className="size-12 rounded-lg" />
                  <div className="flex flex-col items-end gap-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="mb-5 h-7 w-40 self-center" />
                <Skeleton className="mb-6 h-20 w-full rounded-lg" />
                <div className="mb-3 grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-7" />)}
                </div>
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 border-t border-border/60 py-3">
                    {Array.from({ length: 4 }, (_, cellIndex) => <Skeleton key={cellIndex} className="h-4" />)}
                  </div>
                ))}
                <Skeleton className="mt-5 h-16 w-44 self-end rounded-lg" />
                <Skeleton className="mt-auto h-10 w-full" />
              </div>
            </div>
          </aside>
        </div>
        <span className="sr-only">Preparing the invoice editor and live preview.</span>
      </Container>
    </section>
  );
}
