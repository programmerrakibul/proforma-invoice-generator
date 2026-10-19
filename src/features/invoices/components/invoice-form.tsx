"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InvoiceLineItems } from "@/features/invoices/components/invoice-line-items";
import type { CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { CalendarDays, Hash } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

type InvoiceFormValues = CreateInvoiceInput;

export function InvoiceForm() {
  const { control } = useFormContext<InvoiceFormValues>();

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-muted/25 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Step 01</p>
          <CardTitle className="text-base">Invoice details</CardTitle>
          <FieldDescription>Set the reference and issue date for this document.</FieldDescription>
        </CardHeader>
        <CardContent className="p-5">
          <FieldGroup className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="piNumber"><Hash className="size-3.5 text-muted-foreground" /> PI number</FieldLabel>
            <Controller
              name="piNumber"
              control={control}
              render={({ field }) => (
                <Input
                  id="piNumber"
                  {...field}
                  className="h-10 rounded-xl bg-background"
                  placeholder="Enter PI number (e.g., MMF/001/26)"
                />
              )}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="issueDate"><CalendarDays className="size-3.5 text-muted-foreground" /> Issue date</FieldLabel>
            <Controller
              name="issueDate"
              control={control}
              render={({ field }) => (
                <Input id="issueDate" type="date" className="h-10 rounded-xl bg-background" {...field} />
              )}
            />
          </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <InvoiceLineItems />
    </div>
  );
}
