"use client";

export function LoadingState({
  message = "Loading…",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
      <p className="text-xs animate-pulse">{message}</p>
    </div>
  );
}
