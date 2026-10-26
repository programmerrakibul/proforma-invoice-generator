"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceLineItems } from "@/features/invoices/components/invoice-line-items";
import type { CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { Building2, CalendarDays, Hash, MapPin } from "lucide-react";
import { useFormContext } from "react-hook-form";
import Link from "next/link";

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
    setValue,
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
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                className="sm:col-span-2"
                data-invalid={Boolean(errors.customerId)}
              >
                <FieldLabel htmlFor="customerId">Select customer</FieldLabel>
                <select
                  id="customerId"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  {...register("customerId", {
                    onChange: (event) => {
                      const customer = customers.find(
                        (item) => item.id === event.target.value,
                      );
                      if (customer) {
                        setValue("buyer.name", customer.name, {
                          shouldValidate: true,
                        });
                        setValue("buyer.address", customer.address, {
                          shouldValidate: true,
                        });
                      }
                    },
                  })}
                >
                  <option value="">Choose a saved customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
                {customers.length === 0 ? (
                  <Link
                    className="text-xs font-medium text-primary hover:underline"
                    href="/dashboard/customers/new"
                  >
                    Create a customer
                  </Link>
                ) : null}
                {errors.customerId?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.customerId.message}
                  </p>
                ) : null}
                {customers.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Add a customer before creating an invoice.
                  </p>
                ) : null}
              </Field>
              <Field
                className="sm:col-span-2"
                data-invalid={Boolean(errors.buyer?.name)}
              >
                <FieldLabel htmlFor="buyer.name">Company name</FieldLabel>
                <Input
                  id="buyer.name"
                  aria-invalid={Boolean(errors.buyer?.name)}
                  readOnly
                  {...register("buyer.name")}
                />
                {errors.buyer?.name?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.buyer.name.message}
                  </p>
                ) : null}
              </Field>
              <Field
                className="sm:col-span-2"
                data-invalid={Boolean(errors.buyer?.address)}
              >
                <FieldLabel htmlFor="buyer.address">
                  <MapPin /> Address
                </FieldLabel>
                <Textarea
                  id="buyer.address"
                  aria-invalid={Boolean(errors.buyer?.address)}
                  readOnly
                  {...register("buyer.address")}
                />
                {errors.buyer?.address?.message ? (
                  <p className="text-xs text-destructive">
                    {errors.buyer.address.message}
                  </p>
                ) : null}
              </Field>
            </FieldGroup>
          </div>
        </CardContent>
      </Card>

      <InvoiceLineItems />
    </div>
  );
}
