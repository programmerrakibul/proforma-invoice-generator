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
import { fabrics } from "@/data/fabrics";
import type { CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState, type JSX } from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";

type InvoiceFormValues = CreateInvoiceInput;

const fabricOptions: string[] = Array.from(
  new Set(fabrics.map((item) => item.fabric)),
);
const widthOptions: string[] = Array.from({ length: 41 }, (_, index) =>
  String(index + 40),
);

interface FabricSuggestInputProps {
  id: string;
  value: string;
  invalid: boolean;
  onCommit: (value: string) => void;
  onDraft: () => void;
}

function FabricSuggestInput({
  id,
  value,
  invalid,
  onCommit,
  onDraft,
}: FabricSuggestInputProps): JSX.Element {
  const [query, setQuery] = useState<string>(value);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasTyped, setHasTyped] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = `${id}-options`;
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matches = hasTyped
    ? fabricOptions.filter((fabric) =>
        fabric.toLocaleLowerCase().includes(normalizedQuery),
      )
    : fabricOptions;
  const exactMatch = fabricOptions.some(
    (fabric) => fabric.toLocaleLowerCase() === normalizedQuery,
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent): void => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
        setQuery(value);
        setHasTyped(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [value]);

  const commitFabric = (fabric: string): void => {
    setQuery(fabric);
    setHasTyped(false);
    setIsOpen(false);
    onCommit(fabric);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        value={query}
        role="combobox"
        aria-invalid={invalid}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        autoComplete="off"
        className="h-10 rounded-lg bg-background"
        placeholder="Search or enter a fabric"
        onFocus={() => {
          setIsOpen(true);
          setHasTyped(false);
        }}
        onChange={(event) => {
          setQuery(event.currentTarget.value);
          setHasTyped(true);
          setIsOpen(true);
          onDraft();
        }}
        onBlur={(event) => {
          if (
            event.relatedTarget instanceof Node &&
            containerRef.current?.contains(event.relatedTarget)
          ) {
            return;
          }
          setQuery(value);
          setHasTyped(false);
          setIsOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setQuery(value);
            setHasTyped(false);
            setIsOpen(false);
          }
        }}
      />
      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Fabric suggestions"
          className="absolute inset-x-0 top-full z-20 mt-1 flex max-h-56 flex-col gap-1 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md"
        >
          {hasTyped && query.trim() && !exactMatch ? (
            <Button
              type="button"
              variant="secondary"
              role="option"
              aria-selected="false"
              className="h-auto justify-start px-3 py-2 text-left text-sm"
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => commitFabric(query.trim())}
            >
              Use custom fabric: {query.trim()}
            </Button>
          ) : null}
          {matches.map((fabric) => (
            <Button
              key={fabric}
              type="button"
              variant="ghost"
              role="option"
              aria-selected={fabric === value}
              className="h-auto justify-start px-3 py-2 text-left text-sm"
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => commitFabric(fabric)}
            >
              {fabric}
            </Button>
          ))}
          {matches.length === 0 && !(hasTyped && query.trim()) ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No catalog fabrics match.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function InvoiceLineItems() {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();
  const lineItems = useWatch({ control, name: "lineItems" });

  const { fields, append, remove } = useFieldArray<InvoiceFormValues>({
    control,
    name: "lineItems",
  });

  const handleAdd = (): void => {
    append({
      fabric: "",
      construction: "",
      width: "",
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
        item.fabric.trim().length > 0 &&
        item.construction.trim().length > 0 &&
        Number(item.width) >= 40 &&
        Number(item.width) <= 80 &&
        item.style.trim().length > 0 &&
        item.color.trim().length > 0 &&
        Number.isFinite(item.quantity) &&
        item.quantity >= 1 &&
        Number.isFinite(item.unitPrice) &&
        item.unitPrice > 0,
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
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
              <Field
                className="sm:col-span-2 xl:col-span-3"
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
                className="sm:col-span-2 xl:col-span-2"
                data-invalid={Boolean(errors.lineItems?.[index]?.construction)}
              >
                <FieldLabel htmlFor={`lineItems.${index}.construction`}>
                  Construction
                </FieldLabel>
                <Input
                  id={`lineItems.${index}.construction`}
                  aria-invalid={Boolean(
                    errors.lineItems?.[index]?.construction,
                  )}
                  {...register(`lineItems.${index}.construction`)}
                  className="h-10 rounded-lg bg-background"
                  placeholder="e.g. 20x20/108x58"
                />
                {errors.lineItems?.[index]?.construction?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.lineItems[index]?.construction?.message}
                  </p>
                ) : null}
              </Field>

              <Field
                className="sm:col-span-2 xl:col-span-2"
                data-invalid={Boolean(errors.lineItems?.[index]?.width)}
              >
                <FieldLabel htmlFor={`lineItems.${index}.width`}>
                  Width (inches)
                </FieldLabel>
                <Controller
                  control={control}
                  name={`lineItems.${index}.width`}
                  render={({ field: widthField }) => (
                    <div className="flex gap-2">
                      <Input
                        {...widthField}
                        id={`lineItems.${index}.width`}
                        type="number"
                        min="40"
                        max="80"
                        step="any"
                        aria-invalid={Boolean(errors.lineItems?.[index]?.width)}
                        className="h-10 min-w-0 flex-1 rounded-lg bg-background"
                        placeholder="40–80"
                      />
                      <Select
                        value={widthField.value}
                        onValueChange={(value) => widthField.onChange(value)}
                      >
                        <SelectTrigger
                          className="h-10 w-20 rounded-lg bg-background"
                          aria-label={`Choose width for item ${index + 1}`}
                        >
                          <SelectValue placeholder="List" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {widthOptions.map((width) => (
                              <SelectItem key={width} value={width}>
                                {width}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors.lineItems?.[index]?.width?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.lineItems[index]?.width?.message}
                  </p>
                ) : null}
              </Field>

              <Field
                className="sm:col-span-2 xl:col-span-2"
                data-invalid={Boolean(errors.lineItems?.[index]?.style)}
              >
                <FieldLabel htmlFor={`lineItems.${index}.style`}>
                  Style
                </FieldLabel>
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
              </Field>

              <Field
                className="sm:col-span-1 xl:col-span-1"
                data-invalid={Boolean(errors.lineItems?.[index]?.color)}
              >
                <FieldLabel htmlFor={`lineItems.${index}.color`}>
                  Color
                </FieldLabel>
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
              </Field>

              <Field
                className="sm:col-span-1 xl:col-span-1"
                data-invalid={Boolean(errors.lineItems?.[index]?.quantity)}
              >
                <FieldLabel htmlFor={`lineItems.${index}.quantity`}>
                  Quantity
                </FieldLabel>
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
              </Field>

              <Field
                className="sm:col-span-2 xl:col-span-2"
                data-invalid={Boolean(errors.lineItems?.[index]?.unitPrice)}
              >
                <FieldLabel htmlFor={`lineItems.${index}.unitPrice`}>
                  Unit price
                </FieldLabel>
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
              </Field>
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
