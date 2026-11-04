"use client";

import { Spinner } from "@/components/ui/spinner";

export function LoadingState({ message = "Loading…" }: { message?: string }) {
  return (
    <div
      className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-border/70 bg-card/70 px-6 text-center text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Spinner className="size-5" />
      </span>
      <p className="text-sm font-medium text-foreground">{message}</p>
    </div>
  );
}
