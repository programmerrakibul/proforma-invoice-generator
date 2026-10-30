import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Sparkles } from "lucide-react";

export default function GlobalLoading() {
  return (
    <main
      className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background px-5 py-12"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/4 size-80 rounded-full bg-primary/10 blur-3xl motion-safe:animate-pulse motion-reduce:animate-none"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 size-96 rounded-full bg-accent/60 blur-3xl motion-safe:animate-pulse motion-reduce:animate-none"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-6 flex size-24 items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-dashed border-primary/35 motion-safe:animate-spin motion-reduce:animate-none"
            />
            <div className="absolute inset-2 rounded-full border border-primary/15" />
            <div className="relative flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <FileText aria-hidden="true" className="size-6" />
            </div>
            <span className="absolute right-1 top-3 flex size-6 items-center justify-center rounded-full border-2 border-background bg-accent text-accent-foreground">
              <Sparkles aria-hidden="true" className="size-3" />
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            M.M FABRICS
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Preparing your workspace
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            We’re getting your invoices and tools ready. This should only take a
            moment.
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/90 p-5 shadow-xl shadow-primary/5 backdrop-blur-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-xl" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
          <div
            className="mt-5 flex items-center justify-center gap-2"
            aria-hidden="true"
          >
            <span className="size-1.5 rounded-full bg-primary motion-safe:animate-pulse motion-reduce:animate-none" />
            <span className="size-1.5 rounded-full bg-primary/70 motion-safe:animate-pulse motion-reduce:animate-none motion-safe:[animation-delay:150ms]" />
            <span className="size-1.5 rounded-full bg-primary/40 motion-safe:animate-pulse motion-reduce:animate-none motion-safe:[animation-delay:300ms]" />
          </div>
        </div>
        <span className="sr-only">Loading the application.</span>
      </div>
    </main>
  );
}
