"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InvoiceFormValues } from "@/features/invoices/schemas/invoice.schema";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useRef } from "react";
import {
  Controller,
  useFieldArray,
  UseFieldArrayAppend,
  useFormContext,
  useWatch,
} from "react-hook-form";
import FabricSuggestInput from "./fabric-suggest-input";
import InvoiceFabricLineItems from "./invoice-fabric-line-items";

const widthOptions: string[] = Array.from({ length: 41 }, (_, index) =>
  String(index + 40)
);

export function InvoiceLineItems() {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();
  const lineItems = useWatch({ control, name: "lineItems" });
  const fabricHandlers = useRef<
    Record<
      number,
      {
        append: UseFieldArrayAppend<
          InvoiceFormValues,
          `lineItems.${number}.fabricLineItems`
        >;
        canAdd: boolean;
      }
    >
  >({});

  const { fields, append, remove } = useFieldArray<InvoiceFormValues>({
    control,
    name: "lineItems",
  });

  const handleAdd = (): void => {
    append({
      fabric: "",
      construction: "",
      width: "",
      fabricLineItems: [
        {
          style: "",
          color: "",
          quantity: 1,
          unitPrice: 0,
          totalAmount: 0,
        },
      ],
    });
  };

  const handleFabricLineItemAdd = (index: number) => {
    const handler = fabricHandlers.current[index];
    if (!handler) return;

    handler.append({
      style: "",
      color: "",
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
    });
  };

  const canAddLineItem =
    lineItems.length > 0 &&
    lineItems.every(
      (item) =>
        item.fabric.trim().length > 0 &&
        item.construction.trim().length > 0 &&
        Number(item.width) >= 40 &&
        Number(item.width) <= 80 &&
        item.fabricLineItems.length > 0
    );

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="sticky top-20 z-10 -mx-5 -mt-5 flex items-center justify-between border-b border-border/70 bg-card px-5 pb-4 pt-5">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Step 02
          </p>
          <h3 className="text-base font-semibold tracking-tight">
            Goods and pricing
          </h3>
          <p className="text-xs text-muted-foreground">
            Choose a fabric preset or enter your own fabric details.
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
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant={"ghost"}
                  size={"icon-sm"}
                  onClick={() => handleFabricLineItemAdd(index)}
                >
                  <PlusIcon />
                </Button>
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
            </div>
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-12">
              <Field
                className="sm:col-span-4 col-span-1 lg:col-span-12 xl:col-span-5"
                data-invalid={Boolean(errors.lineItems?.[index]?.fabric)}
              >
                <FieldLabel htmlFor={`lineItems.${index}.fabric`}>
                  Fabric
                </FieldLabel>
                <FabricSuggestInput
                  id={`lineItems.${index}.fabric`}
                  value={lineItems[index]?.fabric ?? ""}
                  invalid={Boolean(errors.lineItems?.[index]?.fabric)}
                  onCommit={(fabric) =>
                    setValue(`lineItems.${index}.fabric`, fabric, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  onDraft={() =>
                    setValue(`lineItems.${index}.fabric`, "", {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
                {errors.lineItems?.[index]?.fabric?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.lineItems[index]?.fabric?.message}
                  </p>
                ) : null}
              </Field>

              <Field
                className="col-span-1 sm:col-span-4 lg:col-span-6 xl:col-span-4"
                data-invalid={Boolean(errors.lineItems?.[index]?.construction)}
              >
                <FieldLabel htmlFor={`lineItems.${index}.construction`}>
                  Construction
                </FieldLabel>
                <Input
                  id={`lineItems.${index}.construction`}
                  aria-invalid={Boolean(
                    errors.lineItems?.[index]?.construction
                  )}
                  {...register(`lineItems.${index}.construction`)}
                  placeholder="e.g. 20x20/108x58"
                />
                {errors.lineItems?.[index]?.construction?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.lineItems[index]?.construction?.message}
                  </p>
                ) : null}
              </Field>

              <Field
                className="col-span-1 sm:col-span-4 lg:col-span-6 xl:col-span-3"
                data-invalid={Boolean(errors.lineItems?.[index]?.width)}
              >
                <FieldLabel htmlFor={`lineItems.${index}.width`}>
                  Width (inches)
                </FieldLabel>
                <Controller
                  control={control}
                  name={`lineItems.${index}.width`}
                  render={({ field: widthField }) => (
                    <Select
                      value={widthField.value}
                      onValueChange={(value) => widthField.onChange(value)}
                    >
                      <SelectTrigger
                        id={`lineItems.${index}.width`}
                        aria-invalid={Boolean(errors.lineItems?.[index]?.width)}
                      >
                        <SelectValue placeholder="Select width from 40 to 80" />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        <SelectGroup>
                          {widthOptions.map((width) => (
                            <SelectItem key={width} value={width}>
                              {width} inches
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.lineItems?.[index]?.width?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.lineItems[index]?.width?.message}
                  </p>
                ) : null}
              </Field>

              <InvoiceFabricLineItems
                index={index}
                onReady={(handlers) => {
                  fabricHandlers.current[index] = handlers;
                }}
              />
            </FieldGroup>
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
