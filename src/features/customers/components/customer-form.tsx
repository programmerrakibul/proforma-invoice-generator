"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCustomerAction } from "@/features/customers/actions/customer-actions";
import {
  createCustomerSchema,
  type CreateCustomerInput,
} from "@/features/customers/schemas/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CustomerForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema),
  });
  const onSubmit = async (values: CreateCustomerInput): Promise<void> => {
    setSaving(true);
    const result = await createCustomerAction(values);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Customer created");
    router.push("/customers");
    router.refresh();
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl space-y-5 rounded-2xl border bg-card p-6"
    >
      <label className="block space-y-2 text-sm">
        Customer name
        <Input {...register("name")} />
        {errors.name?.message ? (
          <span className="text-destructive">{errors.name.message}</span>
        ) : null}
      </label>
      <label className="block space-y-2 text-sm">
        Address
        <Input {...register("address")} />
        {errors.address?.message ? (
          <span className="text-destructive">{errors.address.message}</span>
        ) : null}
      </label>
      <label className="block space-y-2 text-sm">
        Email (optional)
        <Input
          type="email"
          {...register("email", {
            setValueAs: (value: string) => value.trim() || undefined,
          })}
        />
        {errors.email?.message ? (
          <span className="text-destructive">{errors.email.message}</span>
        ) : null}
      </label>
      <label className="block space-y-2 text-sm">
        Phone (optional)
        <Input
          {...register("phone", {
            setValueAs: (value: string) => value.trim() || undefined,
          })}
          placeholder="123-456-7890"
        />
        {errors.phone?.message ? (
          <span className="text-destructive">{errors.phone.message}</span>
        ) : null}
      </label>
      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Create customer"}
      </Button>
    </form>
  );
}
