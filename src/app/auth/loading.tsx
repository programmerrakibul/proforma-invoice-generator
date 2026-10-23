import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <main
      className="min-h-[calc(100vh-4rem)] bg-muted/30"
      aria-busy="true"
      aria-label="Loading account page"
    >
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-16">
        <section
          aria-hidden="true"
          className="relative hidden min-h-150 overflow-hidden rounded-[2rem] bg-primary p-10 shadow-xl lg:flex lg:flex-col lg:justify-between"
        >
          <Skeleton className="h-5 w-48 bg-primary-foreground/15" />
          <div className="flex flex-col gap-6">
            <Skeleton className="size-14 rounded-2xl bg-primary-foreground/15" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-10 w-full max-w-lg bg-primary-foreground/15" />
              <Skeleton className="h-10 w-4/5 bg-primary-foreground/15" />
              <Skeleton className="mt-2 h-16 w-full max-w-md bg-primary-foreground/10" />
            </div>
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="size-6 rounded-full bg-primary-foreground/15" />
                  <Skeleton className="h-4 w-64 max-w-[80%] bg-primary-foreground/15" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="h-4 w-60 bg-primary-foreground/10" />
        </section>

        <section className="mx-auto w-full max-w-md">
          <Skeleton className="mb-7 h-5 w-16" />
          <div className="mb-8 flex flex-col gap-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-10 w-full max-w-sm" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="flex flex-col gap-5">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="mt-1 h-10 w-full rounded-xl" />
          </div>
          <Skeleton className="mx-auto mt-7 h-4 w-64 max-w-full" />
          <Skeleton className="mx-auto mt-10 h-3 w-72 max-w-full" />
        </section>
      </div>
    </main>
  );
}
