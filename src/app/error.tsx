"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const message = (error as Error)?.message || "Something went wrong!";

  return (
    <ErrorState
      title={(error as Error)?.name || "Error"}
      description={message}
      onRetry={retry}
      className="min-h-dvh w-full"
    />
  );
}
