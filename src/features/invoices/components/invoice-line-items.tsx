"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

type InvoiceFormValues = CreateInvoiceInput;

export function InvoiceLineItems() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();
  const lineItems = useWatch({ control, name: "lineItems" });

  const { fields, append, remove } = useFieldArray<InvoiceFormValues>({
    control,
    name: "lineItems",
  });

  const handleAdd = () => {
    append({
      description: "",
      style: "",
      color: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    });
  };

  const canAddLineItem =
    lineItems.length > 0 &&
    lineItems.every(
      (item) =>
        item.description.trim().length > 0 &&
        item.style.trim().length > 0 &&
        item.color.trim().length > 0 &&
        Number.isFinite(item.quantity) &&
        item.quantity >= 1 &&
        Number.isFinite(item.unitPrice) &&
        item.unitPrice > 0,
    );

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Step 02
          </p>
          <h3 className="text-base font-semibold tracking-tight">
            Goods and pricing
          </h3>
          <p className="text-xs text-muted-foreground">
            Add each product, then set quantity and unit price.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="rounded-full px-3"
          onClick={handleAdd}
          disabled={!canAddLineItem}
        >
          <PlusIcon data-icon="inline-start" /> Add item
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="animate-in fade-in slide-in-from-bottom-1 rounded-xl border border-border/70 bg-muted/20 p-4 duration-300"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                ITEM {String(index + 1).padStart(2, "0")}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove item ${index + 1}`}
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2Icon />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-6">
              <div className="flex flex-col gap-2 sm:col-span-3 md:col-span-2">
                <Label
                  htmlFor={`lineItems.${index}.description`}
                  className="text-xs text-muted-foreground"
                >
                  Description of goods
                </Label>
                <Input
                  id={`lineItems.${index}.description`}
                  aria-invalid={Boolean(errors.lineItems?.[index]?.description)}
                  {...register(`lineItems.${index}.description`)}
                  className="h-10 rounded-lg bg-background"
                  placeholder="e.g. 100% cotton woven fabric"
                />
                {errors.lineItems?.[index]?.description?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.lineItems[index]?.description?.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 sm:col-span-3 md:col-span-1">
                <Label
                  htmlFor={`lineItems.${index}.style`}
                  className="text-xs text-muted-foreground"
                >
                  Style
                </Label>
                <Input
                  id={`lineItems.${index}.style`}
                  aria-invalid={Boolean(errors.lineItems?.[index]?.style)}
                  {...register(`lineItems.${index}.style`)}
                  className="h-10 rounded-lg bg-background"
                  placeholder="Style"
                />
                {errors.lineItems?.[index]?.style?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.lineItems[index]?.style?.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor={`lineItems.${index}.color`}
                  className="text-xs text-muted-foreground"
                >
                  Color
                </Label>
                <Input
                  id={`lineItems.${index}.color`}
                  aria-invalid={Boolean(errors.lineItems?.[index]?.color)}
                  {...register(`lineItems.${index}.color`)}
                  className="h-10 rounded-lg bg-background"
                  placeholder="Color"
                />
                {errors.lineItems?.[index]?.color?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.lineItems[index]?.color?.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor={`lineItems.${index}.quantity`}
                  className="text-xs text-muted-foreground"
                >
                  Quantity
                </Label>
                <Input
                  id={`lineItems.${index}.quantity`}
                  type="number"
                  min="1"
                  aria-invalid={Boolean(errors.lineItems?.[index]?.quantity)}
                  {...register(`lineItems.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                  className="h-10 rounded-lg bg-background"
                  placeholder="1"
                />
                {errors.lineItems?.[index]?.quantity?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.lineItems[index]?.quantity?.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor={`lineItems.${index}.unitPrice`}
                  className="text-xs text-muted-foreground"
                >
                  Unit Price
                </Label>
                <Input
                  id={`lineItems.${index}.unitPrice`}
                  type="number"
                  step="0.01"
                  min="0"
                  aria-invalid={Boolean(errors.lineItems?.[index]?.unitPrice)}
                  {...register(`lineItems.${index}.unitPrice`, {
                    valueAsNumber: true,
                  })}
                  className="h-10 rounded-lg bg-background"
                  placeholder="0.00"
                />
                {errors.lineItems?.[index]?.unitPrice?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.lineItems[index]?.unitPrice?.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No products yet. Add an item to begin your invoice.
        </div>
      )}
    </section>
  );
}
