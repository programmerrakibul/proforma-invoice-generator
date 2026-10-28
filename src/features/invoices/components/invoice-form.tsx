"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InvoiceLineItems } from "@/features/invoices/components/invoice-line-items";
import type { CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { Building2, CalendarDays, Hash } from "lucide-react";
import { useFormContext } from "react-hook-form";
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

export function InvoiceForm({ customers }: InvoiceFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateInvoiceInput>();

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
          <FieldGroup className="grid grid-cols-2 gap-4">
            <Field data-invalid={Boolean(errors.piNumber)}>
              <FieldLabel htmlFor="piNumber">
                <Hash /> PI number
              </FieldLabel>
              <Input
                id="piNumber"
                aria-invalid={Boolean(errors.piNumber)}
                placeholder="MMF/001/26"
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
    </div>
  );
}
