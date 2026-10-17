"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { InvoiceLineItems } from "@/features/invoices/components/invoice-line-items";
import { InvoiceSummary } from "@/features/invoices/components/invoice-summary";
import { type CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";

type InvoiceFormValues = CreateInvoiceInput;

interface InvoiceFormProps {
  companyProfile: InvoiceFormValues["seller"];
}

export function InvoiceForm({ companyProfile }: InvoiceFormProps) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  const currencyOptions = ["USD", "EUR", "GBP", "BDT"];

  return (
    <div className="space-y-6">
      {/* Invoice details */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="font-serif font-semibold text-ink text-sm mb-4 flex items-center gap-2">
          <span className="h-3 w-0.5 bg-primary rounded-full" /> Invoice details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <Label htmlFor="piNumber">PI number</Label>
            <Input
              id="piNumber"
              {...register("piNumber")}
              className="h-7 text-xs"
            />
            {errors.piNumber && (
              <p className="text-xs text-destructive mt-1">{errors.piNumber.message}</p>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="issueDate">Issue date</Label>
            <Controller
              control={control}
              name="issueDate"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger>
                    <Input
                      id="issueDate"
                      {...field}
                      placeholder="Select date"
                      className="h-7 text-xs"
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="p-1 w-64">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(selectedDate: Date | undefined) => {
                        field.onChange(
                          selectedDate
                            ? selectedDate.toISOString().slice(0, 10)
                            : "",
                        );
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.issueDate && (
              <p className="text-xs text-destructive mt-1">{errors.issueDate.message}</p>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="currency">Currency</Label>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-7 text-xs" id="currency">
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.currency && (
              <p className="text-xs text-destructive mt-1">{errors.currency.message}</p>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Products / line items */}
      <section className="rounded-lg border border-border bg-card p-5">
        <h2 className="font-serif font-semibold text-ink text-sm mb-2">
          Products / line items
        </h2>
        <InvoiceLineItems currency="USD" onAdd={() => {}} />
      </section>

      <Separator />

      {/* Totals summary */}
      <InvoiceSummary />
    </div>
  );
}
