"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const message = (error as Error)?.message || "Something went wrong!";

  return (
    <div>
      <h2>{message}</h2>
      <Button onClick={() => retry()}>Try again</Button>
    </div>
  );
}
