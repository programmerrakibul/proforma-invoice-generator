"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceLineItems } from "@/features/invoices/components/invoice-line-items";
import { INVOICE_NOTE_FIELDS } from "@/features/invoices/utils/build-invoice-document";
import type { CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { Building2, CalendarDays, Hash, MapPin } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

export function InvoiceForm() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CreateInvoiceInput>();

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/25 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Step 01</p>
          <CardTitle className="text-base">Invoice details</CardTitle>
          <FieldDescription>Set the reference, issue date, and buyer for this document.</FieldDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 p-5">
          <FieldGroup className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errors.piNumber)}>
              <FieldLabel htmlFor="piNumber"><Hash /> PI number</FieldLabel>
              <Input
                id="piNumber"
                aria-invalid={Boolean(errors.piNumber)}
                className="h-10 rounded-xl bg-background"
                placeholder="MMF/001/26"
                {...register("piNumber")}
              />
              {errors.piNumber?.message ? <p className="text-xs text-destructive">{errors.piNumber.message}</p> : null}
            </Field>
            <Field data-invalid={Boolean(errors.issueDate)}>
              <FieldLabel htmlFor="issueDate"><CalendarDays /> Issue date</FieldLabel>
              <Input
                id="issueDate"
                type="date"
                aria-invalid={Boolean(errors.issueDate)}
                className="h-10 rounded-xl bg-background"
                {...register("issueDate")}
              />
              {errors.issueDate?.message ? <p className="text-xs text-destructive">{errors.issueDate.message}</p> : null}
            </Field>
          </FieldGroup>

          <div className="flex flex-col gap-4 border-t border-border/60 pt-5">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold"><Building2 className="size-4 text-primary" /> Buyer / Consignee</p>
              <p className="mt-1 text-xs text-muted-foreground">These details appear on the invoice.</p>
            </div>
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field className="sm:col-span-2" data-invalid={Boolean(errors.buyer?.name)}>
                <FieldLabel htmlFor="buyer.name">Company name</FieldLabel>
                <Input id="buyer.name" aria-invalid={Boolean(errors.buyer?.name)} className="h-10 rounded-xl bg-background" {...register("buyer.name")} />
                {errors.buyer?.name?.message ? <p className="text-xs text-destructive">{errors.buyer.name.message}</p> : null}
              </Field>
              <Field className="sm:col-span-2" data-invalid={Boolean(errors.buyer?.address)}>
                <FieldLabel htmlFor="buyer.address"><MapPin /> Address</FieldLabel>
                <Textarea id="buyer.address" aria-invalid={Boolean(errors.buyer?.address)} className="min-h-20 rounded-xl bg-background" {...register("buyer.address")} />
                {errors.buyer?.address?.message ? <p className="text-xs text-destructive">{errors.buyer.address.message}</p> : null}
              </Field>
              <Field data-invalid={Boolean(errors.buyer?.destinationCountry)}>
                <FieldLabel htmlFor="buyer.destinationCountry">Destination country</FieldLabel>
                <Input id="buyer.destinationCountry" aria-invalid={Boolean(errors.buyer?.destinationCountry)} className="h-10 rounded-xl bg-background" {...register("buyer.destinationCountry")} />
                {errors.buyer?.destinationCountry?.message ? <p className="text-xs text-destructive">{errors.buyer.destinationCountry.message}</p> : null}
              </Field>
            </FieldGroup>
          </div>
        </CardContent>
      </Card>

      <InvoiceLineItems />

      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/25 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Step 03</p>
          <CardTitle className="text-base">Notes and shipping terms</CardTitle>
          <FieldDescription>Banking, delivery, payment, and validity details.</FieldDescription>
        </CardHeader>
        <CardContent className="p-5">
          <FieldGroup className="grid grid-cols-1 gap-4">
            {INVOICE_NOTE_FIELDS.map((note) => {
              const error = errors.notes?.[note.key]?.message;
              const isLongField = note.key === "advisingBank" || note.key === "goodsDeliveryDestination";
              return (
                <Controller
                  key={note.key}
                  control={control}
                  name={`notes.${note.key}`}
                  render={({ field }) => (
                    <Field data-invalid={Boolean(error)}>
                      <FieldLabel htmlFor={`notes.${note.key}`}>{note.label}</FieldLabel>
                      {isLongField ? (
                        <Textarea id={`notes.${note.key}`} aria-invalid={Boolean(error)} className="min-h-16 rounded-xl bg-background" {...field} />
                      ) : (
                        <Input id={`notes.${note.key}`} aria-invalid={Boolean(error)} className="h-10 rounded-xl bg-background" {...field} />
                      )}
                      {error ? <p className="text-xs text-destructive">{error}</p> : null}
                    </Field>
                  )}
                />
              );
            })}
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
