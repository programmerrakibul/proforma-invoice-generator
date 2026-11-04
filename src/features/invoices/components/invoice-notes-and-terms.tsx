"use client";

import type { InvoiceCurrency } from "@/config/bank-accounts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultTermsAndConditions } from "@/data/terms-and-conditions";
import type { InvoiceFormValues } from "@/features/invoices/schemas/invoice.schema";
import { PlusIcon, Trash2Icon } from "lucide-react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";

interface InvoiceNotesAndTermsProps {
  currency: InvoiceCurrency;
}

export function InvoiceNotesAndTerms({ currency }: InvoiceNotesAndTermsProps) {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();
  const notesArray = useFieldArray({ control, name: "notes" });
  const notes = useWatch({ control, name: "notes" }) ?? [];
  const terms = useWatch({ control, name: "termsAndConditions" }) ?? [];

  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="border-b border-border/60 bg-muted/25 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          Step 03
        </p>
        <CardTitle className="text-base">
          Shipment, banking, and terms
        </CardTitle>
        <CardDescription>
          Edit both labels and values for shipment and banking details. The
          advising bank changes automatically with the currency.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 p-5">
        <FieldGroup className="flex flex-col gap-4">
          {notesArray.fields.map((field, index) => {
            const note = notes[index];
            const labelError = errors.notes?.[index]?.label?.message;
            const valueError = errors.notes?.[index]?.value?.message;
            const isCustomerDestination =
              (note?.key ?? field.key) === "goodsDeliveryDestination";
            const label = note?.label ?? field.label;

            return (
              <div
                key={field.id}
                className="grid grid-cols-1 items-start gap-3 rounded-lg border border-border/70 p-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_auto]"
              >
                <Field data-invalid={Boolean(labelError)}>
                  <FieldLabel htmlFor={`notes.${index}.label`}>
                    Detail label
                  </FieldLabel>
                  <Input
                    id={`notes.${index}.label`}
                    aria-invalid={Boolean(labelError)}
                    {...register(`notes.${index}.label`)}
                  />
                  {labelError ? (
                    <p className="text-xs text-destructive">{labelError}</p>
                  ) : null}
                </Field>
                <Field data-invalid={Boolean(valueError)}>
                  <FieldLabel htmlFor={`notes.${index}.value`}>
                    {label || "Detail value"}
                  </FieldLabel>
                  <Textarea
                    id={`notes.${index}.value`}
                    aria-invalid={Boolean(valueError)}
                    readOnly={isCustomerDestination}
                    {...register(`notes.${index}.value`)}
                  />
                  {isCustomerDestination ? (
                    <p className="text-xs text-muted-foreground">
                      This value follows the selected customer name.
                    </p>
                  ) : null}
                  {valueError ? (
                    <p className="text-xs text-destructive">{valueError}</p>
                  ) : null}
                </Field>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${label || "goods detail"}`}
                  onClick={() => notesArray.remove(index)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            );
          })}
        </FieldGroup>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() =>
            notesArray.append({
              key: `custom-${crypto.randomUUID()}`,
              label: "",
              value: "",
            })
          }
        >
          <PlusIcon data-icon="inline-start" />
          Add goods detail
        </Button>

        {currency === "USD" ? (
          <section className="flex flex-col gap-4 border-t border-border/60 pt-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold">
                  {terms.length === 0
                    ? "Good to add terms and conditions"
                    : "Terms and conditions"}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add, edit, or remove terms for this invoice.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setValue("termsAndConditions", [...terms, ""], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <PlusIcon data-icon="inline-start" />
                {terms.length === 0 ? "Add terms" : "Add term"}
              </Button>
            </div>
            {terms.map((_, index) => (
              <Controller
                key={index}
                control={control}
                name={`termsAndConditions.${index}`}
                render={({ field: termField }) => {
                  const error = errors.termsAndConditions?.[index]?.message;
                  return (
                    <Field data-invalid={Boolean(error)}>
                      <div className="flex items-center justify-between gap-3">
                        <FieldLabel htmlFor={`termsAndConditions.${index}`}>
                          Term {index + 1}
                        </FieldLabel>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Remove term ${index + 1}`}
                          onClick={() =>
                            setValue(
                              "termsAndConditions",
                              terms.filter(
                                (_, termIndex) => termIndex !== index
                              ),
                              {
                                shouldDirty: true,
                                shouldValidate: true,
                              }
                            )
                          }
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                      <Textarea
                        id={`termsAndConditions.${index}`}
                        aria-invalid={Boolean(error)}
                        {...termField}
                      />
                      {error ? (
                        <p className="text-xs text-destructive">{error}</p>
                      ) : null}
                    </Field>
                  );
                }}
              />
            ))}
            {terms.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Default terms: {defaultTermsAndConditions.length} suggested
                terms are available for new invoices.
              </p>
            ) : null}
          </section>
        ) : null}
      </CardContent>
    </Card>
  );
}
