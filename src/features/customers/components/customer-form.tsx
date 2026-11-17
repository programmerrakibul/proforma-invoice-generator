"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  createCustomerAction,
  updateCustomerAction,
  type CustomerListItem,
} from "@/features/customers/actions/customer-actions";
import {
  createCustomerSchema,
  type CreateCustomerInput,
} from "@/features/customers/schemas/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CustomerFormProps {
  customer?: CustomerListItem;
  onSaved: () => void;
}

export function CustomerForm({ customer, onSaved }: CustomerFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: customer?.name ?? "",
      address: customer?.address ?? "",
      email: customer?.email || undefined,
      phone: customer?.phone || undefined,
    },
  });

  const onSubmit = async (values: CreateCustomerInput): Promise<void> => {
    setSaving(true);
    try {
      const result = customer
        ? await updateCustomerAction(customer.id, values)
        : await createCustomerAction(values);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(customer ? "Customer updated" : "Customer created");
      onSaved();
      router.refresh();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save customer.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FieldGroup>
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="customer-name">Customer name</FieldLabel>
          <Input
            id="customer-name"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field data-invalid={Boolean(errors.address)}>
          <FieldLabel htmlFor="customer-address">Address</FieldLabel>
          <Input
            id="customer-address"
            aria-invalid={Boolean(errors.address)}
            {...register("address")}
          />
          <FieldError errors={[errors.address]} />
        </Field>
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="customer-email">Email (optional)</FieldLabel>
          <Input
            id="customer-email"
            type="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email", {
              setValueAs: (value: string) => value.trim() || undefined,
            })}
          />
          <FieldError errors={[errors.email]} />
        </Field>
        <Field data-invalid={Boolean(errors.phone)}>
          <FieldLabel htmlFor="customer-phone">Phone (optional)</FieldLabel>
          <Input
            id="customer-phone"
            type="tel"
            placeholder="123-456-7890"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone", {
              setValueAs: (value: string) => value.trim() || undefined,
            })}
          />
          <FieldError errors={[errors.phone]} />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={saving}>
        {saving
          ? customer
            ? "Saving changes…"
            : "Creating customer…"
          : customer
            ? "Save changes"
            : "Create customer"}
      </Button>
    </form>
  );
}
