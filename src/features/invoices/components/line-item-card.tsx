"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2Icon } from "lucide-react";
import { type InvoiceLineItem } from "@/features/invoices/schemas/invoice.schema";
import { calculateLineItemTotal } from "@/features/invoices/utils/calculate-invoice-total";

interface LineItemCardProps {
  item: InvoiceLineItem & { id: string };
  currency: string;
  onRemove: (id: string) => void;
}

export function LineItemCard({
  item,
  currency,
  onRemove,
}: LineItemCardProps) {
  const total = calculateLineItemTotal(item.quantity ?? 0, item.unitPrice ?? 0);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          <span className="font-semibold text-ink text-sm">{item.description}</span>
          <Badge variant="outline">
            {item.style || "—"}
          </Badge>
          <Badge variant="outline">{item.color || "—"}</Badge>
        </div>
        <Separator orientation="vertical" className="hidden sm:block" />
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-end gap-4 text-right sm:text-left">
          <div>
            <span className="text-xs text-muted-foreground block">Qty</span>
            <span className="text-sm font-medium">{item.quantity?.toFixed(3) ?? "0"}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Unit price</span>
            <span className="text-sm font-medium">
              {`${currency} ${Number(item.unitPrice ?? 0).toFixed(2)}`}
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Total</span>
            <span className="text-sm font-medium font-serif">
              {`${currency} ${total.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Unit {item.unit}</span>
        <Button
          variant="destructive"
          size="icon-xs"
          onClick={() => onRemove(item.id)}
          aria-label="Remove item"
        >
          <Trash2Icon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
