"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

type InvoiceFormValues = CreateInvoiceInput;

export function InvoiceLineItems() {
  const { control, register } = useFormContext<InvoiceFormValues>();

  const { fields, append, remove } = useFieldArray<InvoiceFormValues>({
    control,
    name: "lineItems",
  });

  const handleAdd = () => {
    append({
      description: "",
      style: "",
      color: "",
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">Line Items</h3>
          <p className="text-xs text-muted-foreground">
            Add product details with description, style, color, quantity and
            unit price
          </p>
        </div>
        <Button type="button" size="sm" onClick={handleAdd}>
          <PlusIcon className="mr-2 size-3.5" />
          Add Line Item
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor={`lineItems.${index}.description`}>
                  Description of goods
                </Label>
                <Input
                  id={`lineItems.${index}.description`}
                  {...register(`lineItems.${index}.description`)}
                  placeholder="Enter description of goods"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`lineItems.${index}.style`}>Style</Label>
                <Input
                  id={`lineItems.${index}.style`}
                  {...register(`lineItems.${index}.style`)}
                  placeholder="Style"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`lineItems.${index}.color`}>Color</Label>
                <Input
                  id={`lineItems.${index}.color`}
                  {...register(`lineItems.${index}.color`)}
                  placeholder="Color"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`lineItems.${index}.quantity`}>Quantity</Label>
                <Input
                  id={`lineItems.${index}.quantity`}
                  type="number"
                  min="0"
                  {...register(`lineItems.${index}.quantity`)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`lineItems.${index}.unitPrice`}>
                  Unit Price
                </Label>
                <Input
                  id={`lineItems.${index}.unitPrice`}
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`lineItems.${index}.unitPrice`)}
                  placeholder="0.00"
                />
              </div>

              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No line items added. Click &quot;Add Line Item&quot; to start.
        </div>
      )}
    </div>
  );
}
