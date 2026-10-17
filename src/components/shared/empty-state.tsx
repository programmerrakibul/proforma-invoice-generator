"use client";

import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  action,
  actionLabel,
}: {
  title: string;
  description?: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center px-4">
      <h2 className="text-sm font-heading font-medium">{title}</h2>
      {description && (
        <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
      )}
      {action && actionLabel && (
        <Button variant="outline" size="sm" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
