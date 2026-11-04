"use client";

import { Button } from "@/components/ui/button";
import { cn } from "cn";

export function ErrorState({
  title,
  description,
  onRetry,
  className,
}: {
  title: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-64 gap-3 text-center px-4",
        className
      )}
    >
      <h2 className="text-sm font-heading font-medium text-destructive">
        {title}
      </h2>
      {description && (
        <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
