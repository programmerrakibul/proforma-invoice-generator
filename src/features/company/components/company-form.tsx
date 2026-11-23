"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CompanyDocument } from "@/lib/db/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { upsertCompanyProfileAction } from "../actions/upsert-company";
import {
  UpdateCompanyProfileInput,
  updateCompanyProfileSchema,
} from "../validation";
import { useRouter } from "next/navigation";

interface CompanyFormProps {
  profileData: CompanyDocument;
}

const CompanyForm = ({ profileData }: CompanyFormProps) => {
  const router = useRouter();

  console.log(profileData);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(updateCompanyProfileSchema),
    defaultValues: profileData,
  });

  const onSubmit = async (data: UpdateCompanyProfileInput) => {
    try {
      const res = await upsertCompanyProfileAction(data);

      console.log(res);

      if (!res.ok) throw res.message;

      router.refresh();
      toast(res.message || "Company Profile data updated successfully");
    } catch (error: unknown) {
      toast((error as Error).message || " Company Profile update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <FieldLegend>Company information</FieldLegend>
        <FieldContent className="grid grid-cols-1 sm:grid-cols-12 gap-4 md:gap-6">
          <Controller
            name="companyName"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                className="col-span-full"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel
                  htmlFor={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  Name *
                </FieldLabel>
                <Input {...field} id={field.name} disabled={isSubmitting} />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                className="sm:col-span-6"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel
                  htmlFor={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  Email *
                </FieldLabel>
                <Input {...field} id={field.name} disabled={isSubmitting} />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
          <Controller
            name="contactNumber"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                className="sm:col-span-6"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel
                  htmlFor={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  Contact Number *
                </FieldLabel>
                <Input {...field} id={field.name} disabled={isSubmitting} />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </FieldContent>
      </FieldGroup>

      <Separator />

      <FieldGroup>
        <FieldLegend>Business Address</FieldLegend>
        <FieldContent className="grid grid-cols-1 sm:grid-cols-12 gap-4 md:gap-6">
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                className="sm:col-span-6"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel
                  htmlFor={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  Address *
                </FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  rows={4}
                  disabled={isSubmitting}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />

          <Controller
            name="corporateOffice"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                className="sm:col-span-6"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel
                  htmlFor={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  Corporate Office Address *
                </FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  rows={4}
                  disabled={isSubmitting}
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </FieldContent>
      </FieldGroup>

      <Separator />

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
