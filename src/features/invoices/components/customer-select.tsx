"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { getDefaultGoodsDetails } from "@/data/goods";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import type { InvoiceFormValues } from "../schemas/invoice.schema";

export interface CustomerSelectProps {
  customers: Array<{
    id: string;
    name: string;
    address: string;
    email?: string;
    phone?: string;
  }>;
}

const CustomerSelect = ({ customers }: CustomerSelectProps) => {
  const {
    getValues,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  return (
    <>
      <Field data-invalid={Boolean(errors.customerId)}>
        <FieldLabel htmlFor="customerId">Select customer</FieldLabel>
        <select
          id="customerId"
          className="flex w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-input/20 px-2 py-1.5 text-xs/relaxed whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-7 data-[size=sm]:h-6 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5"
          {...register("customerId", {
            onChange: (event) => {
              const customer = customers.find(
                (item) => item.id === event.target.value
              );
              if (customer) {
                setValue("buyer.name", customer.name, {
                  shouldValidate: true,
                });
                setValue("buyer.address", customer.address, {
                  shouldValidate: true,
                });
                const notes = getValues("notes");
                const destinationIndex = notes.findIndex(
                  (note) => note.key === "goodsDeliveryDestination"
                );
                if (destinationIndex >= 0) {
                  setValue(`notes.${destinationIndex}.value`, customer.name, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                } else {
                  const destination = getDefaultGoodsDetails(
                    getValues("currency") ?? "USD"
                  ).find((note) => note.key === "goodsDeliveryDestination");
                  if (destination) {
                    setValue(
                      "notes",
                      [
                        ...notes,
                        {
                          ...destination,
                          value: customer.name,
                        },
                      ],
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      }
                    );
                  }
                }
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
            href="/dashboard/customers"
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
    </>
  );
};

export default CustomerSelect;
