"use client";

import {
  BANK_ACCOUNT_DEFAULTS,
  type InvoiceCurrency,
} from "@/config/bank-accounts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { InvoiceFormValues } from "@/features/invoices/schemas/invoice.schema";
import { INVOICE_NOTE_FIELDS } from "@/features/invoices/utils/build-invoice-document";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

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
  const terms = useWatch({ control, name: "termsAndConditions" });
  const currencyDefaults = BANK_ACCOUNT_DEFAULTS[currency];

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
          Edit invoice notes and terms. Currency changes reset bank and payment
          defaults; review them before exporting.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 p-5">
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {INVOICE_NOTE_FIELDS.map((note) => {
            const error = errors.notes?.[note.key]?.message;
            const description =
              note.key === "advisingBank" && !currencyDefaults.advisingBank
                ? `No verified ${currency} bank details are configured. Enter the correct advising bank and account details.`
                : note.key === "payment" && !currencyDefaults.payment
                  ? `Enter the agreed ${currency} payment terms.`
                  : undefined;

            return (
              <Field key={note.key} data-invalid={Boolean(error)}>
                <FieldLabel htmlFor={`notes.${note.key}`}>
                  {note.label}
                </FieldLabel>
                <Textarea
                  id={`notes.${note.key}`}
                  aria-invalid={Boolean(error)}
                  {...register(`notes.${note.key}`)}
                />
                {description ? (
                  <p className="text-xs text-muted-foreground">{description}</p>
                ) : null}
                {error ? (
                  <p className="text-xs text-destructive">{error}</p>
                ) : null}
              </Field>
            );
          })}
        </FieldGroup>

        <section className="flex flex-col gap-4 border-t border-border/60 pt-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold">Terms and conditions</h3>
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
              Add term
            </Button>
          </div>
          {terms.map((_, index) => (
            <Controller
              key={index}
              control={control}
              name={`termsAndConditions.${index}`}
              render={({ field }) => {
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
                              (_, termIndex) => termIndex !== index,
                            ),
                            { shouldDirty: true, shouldValidate: true },
                          )
                        }
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                    <Textarea
                      id={`termsAndConditions.${index}`}
                      aria-invalid={Boolean(error)}
                      {...field}
                    />
                    {error ? (
                      <p className="text-xs text-destructive">{error}</p>
                    ) : null}
                  </Field>
                );
              }}
            />
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
