"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvoiceLineItems } from "@/features/invoices/components/invoice-line-items";
import type { CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { Controller, useFormContext } from "react-hook-form";

type InvoiceFormValues = CreateInvoiceInput;

export function InvoiceForm() {
  const { control } = useFormContext<InvoiceFormValues>();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="piNumber">PI Number</Label>
            <Controller
              name="piNumber"
              control={control}
              render={({ field }) => (
                <Input
                  id="piNumber"
                  {...field}
                  placeholder="Enter PI number (e.g., MMF/001/26)"
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date</Label>
            <Controller
              name="issueDate"
              control={control}
              render={({ field }) => (
                <Input id="issueDate" type="date" {...field} />
              )}
            />
          </div>
        </CardContent>
      </Card>

      <InvoiceLineItems />
    </div>
  );
}
