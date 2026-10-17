"use client";

import { useCallback, useState } from "react";
import {
  useFieldArray,
  useFormContext,
  Controller,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  PlusIcon,
  Trash2Icon,
  MinusIcon,
  PlusCircleIcon,
  SearchIcon,
} from "lucide-react";
import { toast } from "sonner";
import { calculateLineItemTotal } from "@/features/invoices/utils/calculate-invoice-total";
import { PRODUCTS } from "@/features/invoices/utils/products";
import { type InvoiceLineItem } from "@/features/invoices/schemas/invoice.schema";
import { type CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { LineItemCard } from "@/features/invoices/components/line-item-card";
import { useMediaQuery } from "@/hooks/use-media-query";

type InvoiceFormValues = CreateInvoiceInput;

const DEFAULT_LINE_ITEM: InvoiceLineItem = {
  description: "",
  style: "",
  color: "",
  quantity: undefined,
  unitPrice: undefined,
  unit: "Yds",
};

const UNIT_OPTIONS = ["Yds", "Mtr", "Kg", "Pcs"] as const;

interface InvoiceLineItemsProps {
  currency: string;
  onAdd: () => void;
}

export function InvoiceLineItems({ currency, onAdd }: InvoiceLineItemsProps) {
  const { control, register, setValue, formState } =
    useFormContext<InvoiceFormValues>();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [removedIndex, setRemovedIndex] = useState<number | null>(null);
  const [removedItem, setRemovedItem] = useState<InvoiceLineItem | null>(null);

  const { fields, append, remove, insert } = useFieldArray<InvoiceFormValues>({
    control,
    name: "lineItems",
  });

  const handleAdd = useCallback(() => {
    append({ ...DEFAULT_LINE_ITEM });
    onAdd();
  }, [append, onAdd]);

  const handleRemove = useCallback(
    (index: number) => {
      const item = fields[index];
      setRemovedIndex(index);
      setRemovedItem(item);
      remove(index);
      toast("Product removed", {
        description: "The product row was removed.",
        action: {
          label: "Undo",
          onClick: () => {
            if (removedIndex === null || !removedItem) return;
            insert(removedIndex, removedItem);
            setRemovedIndex(null);
            setRemovedItem(null);
          },
        },
      });
    },
    [fields, remove, insert, removedIndex, removedItem],
  );

  const rowTotal = (quantity: number | undefined, unitPrice: number | undefined) =>
    calculateLineItemTotal(quantity ?? 0, unitPrice ?? 0);

  if (isMobile) {
    return (
      <div className="space-y-3">
        {fields.map((field, index) => {
          const fieldError = formState.errors.lineItems?.[index];
          return (
            <div key={field.id}>
              <LineItemCard
                item={{ ...field, id: field.id }}
                currency={currency}
                onRemove={() => handleRemove(index)}
              />
              {fieldError?.description?.message && (
                <p className="text-xs text-destructive ml-2">
                  {fieldError.description?.message}
                </p>
              )}
            </div>
          );
        })}
        {removedIndex !== null && (
          <div className="p-3 border border-accent bg-accent/50 rounded-lg">
            <p className="text-xs">Removed a product row.</p>
          </div>
        )}
        <Button
          variant="outline"
          onClick={handleAdd}
          className="w-full"
          size="sm"
        >
          <PlusCircleIcon className="size-4 mr-2" /> Add product
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="grid grid-cols-12 gap-2 px-2 text-xs text-muted-foreground font-medium">
          <div className="col-span-5">Description of goods</div>
          <div className="col-span-2">Style</div>
          <div className="col-span-2">Color</div>
          <div className="col-span-1">Qty</div>
          <div className="col-span-1">Unit</div>
          <div className="col-span-1">Unit price</div>
          <div className="col-span-1">Total</div>
          <div className="col-span-1">Action</div>
        </div>
      </div>
      <div className="space-y-1">
        {fields.map((field, index) => {
          const fieldError = formState.errors.lineItems?.[index];
          const hasError = Boolean(fieldError?.description?.message);
          return (
            <div key={field.id} className="grid grid-cols-12 gap-2 px-2 items-center">
              <div className="col-span-5">
                <Controller
                  control={control}
                  name={`lineItems.${index}.description`}
                  render={({ field: f }) => (
                    <Popover>
                      <PopoverTrigger>
                        <Input
                          {...f}
                          placeholder="Search goods…"
                          className="h-7 text-xs"
                          aria-invalid={hasError || undefined}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-48 max-h-60">
                        <Input
                          placeholder="Search"
                          className="w-full px-3 py-2 text-xs border-b"
                          defaultValue=""
                          readOnly
                        />
                        {PRODUCTS.filter(
                          (p) =>
                            !f.value ||
                            p.description
                              .toLowerCase()
                              .includes(f.value.toLowerCase()),
                        ).map((product) => (
                          <button
                            key={product.description}
                            onClick={() => {
                              f.onChange(product.description);
                              setValue(
                                `lineItems.${index}.style`,
                                product.style,
                              );
                              setValue(
                                `lineItems.${index}.color`,
                                product.color,
                              );
                              setValue(`lineItems.${index}.unit`, product.unit);
                            }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-accent transition-colors"
                          >
                            <SearchIcon className="size-3.5 mr-2 text-muted-foreground shrink-0" />
                            {product.description}
                          </button>
                        ))}
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {hasError && (
                  <p className="text-xs text-destructive mt-1">
                    {fieldError?.description?.message ?? ""}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <Input
                  {...register(`lineItems.${index}.style`)}
                  placeholder="Style"
                  className="h-7 text-xs"
                />
              </div>
              <div className="col-span-2">
                <Input
                  {...register(`lineItems.${index}.color`)}
                  placeholder="Color"
                  className="h-7 text-xs"
                />
              </div>
              <div className="col-span-1">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() =>
                      setValue(
                        `lineItems.${index}.quantity`,
                        Math.max(0, (field.quantity ?? 0) - 0.001),
                      )
                    }
                  >
                    <MinusIcon className="size-3.5" />
                  </Button>
                  <Input
                    type="number"
                    min="0"
                    step="0.001"
                    {...register(`lineItems.${index}.quantity`)}
                    className="w-full h-6 text-xs text-right px-1"
                  />
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() =>
                      setValue(
                        `lineItems.${index}.quantity`,
                        (field.quantity ?? 0) + 0.001,
                      )
                    }
                  >
                    <PlusIcon className="size-3.5" />
                  </Button>
                </div>
              </div>
              <div className="col-span-1">
                <Controller
                  control={control}
                  name={`lineItems.${index}.unit`}
                  render={({ field: f }) => (
                    <Select onValueChange={f.onChange} value={f.value}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Yds" />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIT_OPTIONS.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="col-span-1">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register(`lineItems.${index}.unitPrice`)}
                  placeholder="0.00"
                  className="h-7 text-xs text-right"
                />
              </div>
              <div className="col-span-1">
                <span className="text-xs text-right font-medium">
                  {`${currency} ${rowTotal(
                    field.quantity,
                    field.unitPrice,
                  ).toFixed(2)}`}
                </span>
              </div>
              <div className="col-span-1">
                <Button
                  variant="destructive"
                  size="xs"
                  onClick={() => handleRemove(index)}
                  aria-label="Remove item"
                >
                  <Trash2Icon className="size-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {fields.length === 0 && (
        <div className="text-xs text-muted-foreground text-center py-4">
          No products added yet. Click &ldquo;Add product&rdquo; to begin.
        </div>
      )}
      <Button variant="outline" onClick={handleAdd} className="w-full mt-2 size-sm">
        <PlusCircleIcon className="size-4 mr-2" /> Add product
      </Button>
    </div>
  );
}
