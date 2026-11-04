"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INVOICE_CURRENCIES, isInvoiceCurrency } from "@/config/bank-accounts";
import { getBankAccountDetails, getPaymentTerms } from "@/data/bank-accounts";
import { defaultTermsAndConditions } from "@/data/terms-and-conditions";
import { InvoiceLineItems } from "@/features/invoices/components/invoice-line-items";
import { InvoiceNotesAndTerms } from "@/features/invoices/components/invoice-notes-and-terms";
import type { InvoiceFormValues } from "@/features/invoices/schemas/invoice.schema";
import { format } from "date-fns";
import { Building2, CalendarDays, Hash } from "lucide-react";
import { useEffect, useRef } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import CustomerSelect from "./customer-select";

export interface InvoiceFormProps {
  customers: Array<{
    id: string;
    name: string;
    address: string;
    email?: string;
    phone?: string;
  }>;
}

function getLocalDate(value?: string | Date): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? undefined
      : new Date(
          value.getUTCFullYear(),
          value.getUTCMonth(),
          value.getUTCDate()
        );
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? undefined
    : new Date(
        parsed.getUTCFullYear(),
        parsed.getUTCMonth(),
        parsed.getUTCDate()
      );
}

export function InvoiceForm({ customers }: InvoiceFormProps) {
  const {
    control,
    getValues,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();
  const currency = useWatch({ control, name: "currency" }) ?? "USD";
  const previousCurrency = useRef(currency);

  useEffect(() => {
    if (!currency || currency === previousCurrency.current) return;
    const previousValue = previousCurrency.current;
    previousCurrency.current = currency;
    const notes = getValues("notes");
    const bankNoteIndex = notes.findIndex(
      (note) => note.key === "advisingBank"
    );
    if (bankNoteIndex >= 0) {
      setValue(
        `notes.${bankNoteIndex}.value`,
        getBankAccountDetails(currency),
        { shouldDirty: true, shouldValidate: true }
      );
    }
    const paymentNoteIndex = notes.findIndex((note) => note.key === "payment");
    if (paymentNoteIndex >= 0) {
      setValue(`notes.${paymentNoteIndex}.value`, getPaymentTerms(currency), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    if (currency === "BDT") {
      setValue("termsAndConditions", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else if (previousValue === "BDT") {
      setValue("termsAndConditions", [...defaultTermsAndConditions], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [currency, getValues, setValue]);

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/25 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Step 01
          </p>
          <CardTitle className="text-base">Invoice details</CardTitle>
          <FieldDescription>
            Set the reference, issue date, and buyer for this document.
          </FieldDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 p-5">
          <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field data-invalid={Boolean(errors.piNumber)}>
              <FieldLabel htmlFor="piNumber">
                <Hash /> PI number
              </FieldLabel>
              <Input
                id="piNumber"
                readOnly
                aria-invalid={Boolean(errors.piNumber)}
                {...register("piNumber")}
              />
              {errors.piNumber?.message ? (
                <p className="text-xs text-destructive">
                  {errors.piNumber.message}
                </p>
              ) : null}
            </Field>
            <Field data-invalid={Boolean(errors.issueDate)}>
              <FieldLabel htmlFor="issueDate">
                <CalendarDays /> Issue date
              </FieldLabel>
              <Input
                id="issueDate"
                type="date"
                aria-invalid={Boolean(errors.issueDate)}
                {...register("issueDate")}
              />
              {errors.issueDate?.message ? (
                <p className="text-xs text-destructive">
                  {errors.issueDate.message}
                </p>
              ) : null}
            </Field>
            <Field data-invalid={Boolean(errors.currency)}>
              <FieldLabel htmlFor="currency">Currency</FieldLabel>
              <Controller
                control={control}
                name="currency"
                render={({ field }) => (
                  <Select
                    value={field.value ?? "USD"}
                    onValueChange={(value) => {
                      if (
                        typeof value === "string" &&
                        isInvoiceCurrency(value)
                      ) {
                        field.onChange(value);
                      }
                    }}
                  >
                    <SelectTrigger
                      id="currency"
                      aria-invalid={Boolean(errors.currency)}
                    >
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {INVOICE_CURRENCIES.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.currency?.message ? (
                <p className="text-xs text-destructive">
                  {errors.currency.message}
                </p>
              ) : null}
            </Field>
            <Controller
              control={control}
              name="deliveryDate"
              render={({ field }) => {
                const selectedDate = getLocalDate(field.value);
                return (
                  <Field data-invalid={Boolean(errors.deliveryDate)}>
                    <FieldLabel htmlFor="deliveryDate">
                      <CalendarDays /> Delivery date
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            id="deliveryDate"
                            type="button"
                            variant="outline"
                            aria-invalid={Boolean(errors.deliveryDate)}
                            className="w-full justify-start text-left font-normal"
                          />
                        }
                      >
                        <CalendarDays data-icon="inline-start" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span className="text-muted-foreground">
                            Choose a delivery date
                          </span>
                        )}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) =>
                            field.onChange(
                              date ? format(date, "yyyy-MM-dd") : undefined
                            )
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FieldDescription>
                      Optional date shown on the invoice.
                    </FieldDescription>
                    {errors.deliveryDate?.message ? (
                      <p className="text-xs text-destructive">
                        {errors.deliveryDate.message}
                      </p>
                    ) : null}
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <div className="flex flex-col gap-4 border-t border-border/60 pt-5">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Building2 className="size-4 text-primary" /> Buyer / Consignee
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Choose a saved customer. Their saved details appear on the
                invoice.
              </p>
            </div>
            <CustomerSelect customers={customers} />
          </div>
        </CardContent>
      </Card>

      <InvoiceLineItems />
      <InvoiceNotesAndTerms currency={currency} />
    </div>
  );
}
