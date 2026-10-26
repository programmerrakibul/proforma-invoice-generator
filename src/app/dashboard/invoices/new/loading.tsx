import Container from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewInvoiceLoading() {
  return (
    <section
      className="min-h-screen bg-muted/25"
      aria-busy="true"
      aria-label="Loading invoice studio"
    >
      <Container className="flex h-full flex-col py-6 lg:py-8">
        <div className="mb-6 flex flex-col gap-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-56 max-w-full" />
          <Skeleton className="h-12 w-full max-w-xl" />
        </div>

        <div className="min-h-[calc(100vh-13rem)]">
          <div className="grid min-h-[calc(100vh-13rem)] grid-cols-1 items-start gap-5 lg:grid-cols-2">
            <div className="min-w-0">
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-6">
                <div className="flex flex-col gap-6">
                  <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-border/60 bg-muted/25 px-5 py-4">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-5 w-36" />
                      <Skeleton className="h-3 w-64 max-w-full" />
                    </div>
                    <div className="flex flex-col gap-6 p-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-10 rounded-xl" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-10 rounded-xl" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 border-t border-border/60 pt-5">
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-36" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Skeleton className="h-10 rounded-xl sm:col-span-2" />
                          <Skeleton className="h-20 rounded-xl sm:col-span-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-5 w-36" />
                        <Skeleton className="h-3 w-56 max-w-full" />
                      </div>
                      <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="size-7 rounded-md" />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-6">
                        <Skeleton className="h-10 rounded-lg sm:col-span-3 md:col-span-2" />
                        <Skeleton className="h-10 rounded-lg sm:col-span-3 md:col-span-1" />
                        <Skeleton className="h-10 rounded-lg" />
                        <Skeleton className="h-10 rounded-lg" />
                        <Skeleton className="h-10 rounded-lg" />
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-0 -mx-4 flex justify-end gap-2 border-t border-border/70 bg-card/95 px-4 pb-2 pt-4 backdrop-blur sm:-mx-6 sm:px-6">
                    <Skeleton className="h-8 w-24 rounded-md" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 lg:sticky lg:top-20">
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border/70 bg-card px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
                <div className="min-h-152 overflow-auto bg-muted/40 p-3 sm:p-5">
                  <div className="mx-auto flex min-h-[297mm] w-[210mm] flex-col bg-white p-[15.4mm] shadow-lg">
                    <div className="flex items-start justify-between gap-6 pb-5">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-14 rounded-md" />
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-5 w-36" />
                          <Skeleton className="h-3 w-28" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="mb-5 h-8 w-40 self-center" />
                    <Skeleton className="mb-5 h-16 w-full" />
                    <div className="mb-7 grid grid-cols-[1.35fr_0.65fr] gap-8">
                      <Skeleton className="h-28" />
                      <Skeleton className="h-28" />
                    </div>
                    <Skeleton className="mb-5 h-8 w-full" />
                    {Array.from({ length: 2 }, (_, index) => (
                      <Skeleton key={index} className="mb-2 h-8 w-full" />
                    ))}
                    <Skeleton className="mb-7 mt-3 h-12 w-48 self-end" />
                    <Skeleton className="mb-6 h-14 w-full rounded-md" />
                    <div className="mt-auto grid grid-cols-2 gap-10">
                      <Skeleton className="h-20" />
                      <Skeleton className="h-20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span className="sr-only">
            Preparing the invoice editor and live preview.
          </span>
        </div>
      </Container>
    </section>
  );
}
