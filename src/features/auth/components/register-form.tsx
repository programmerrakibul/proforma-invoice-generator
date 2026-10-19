"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AuthField } from "@/features/auth/components/auth-field";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAuthClient } from "better-auth/client";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface RegisterFormProps {
  redirectTo: string;
}

const authClient = createAuthClient();

export function RegisterForm({ redirectTo  = "/invoices"}: RegisterFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    setServerError(null);
    try {
      const result = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (result.error) {
        throw new Error(
          result.error.message ??
            "We couldn’t create your account. Please try again.",
        );
        return;
      }
      toast.success("Your workspace is ready", {
        description: "Welcome to M.M FABRICS.",
      });
      router.replace(redirectTo);
      router.refresh();
    } catch (error: unknown) {
      setServerError(
        error instanceof Error
          ? error.message
          : "We couldn’t create your account. Please try again.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 rounded-2xl border border-border/70 bg-card p-6 shadow-lg shadow-foreground/3 sm:p-8"
    >
      {serverError ? (
        <Alert variant="destructive">
          <AlertTitle>Registration failed</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}
      <AuthField
        id="name"
        label="Full name"
        autoComplete="name"
        placeholder="Your name"
        error={errors.name?.message}
        {...register("name")}
      />
      <AuthField
        id="email"
        label="Work email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <AuthField
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        error={errors.password?.message}
        {...register("password")}
      />
      <AuthField
        id="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="Enter your password again"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 h-11 w-full rounded-xl text-sm font-semibold shadow-md shadow-primary/15"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="animate-spin" data-icon="inline-start" />{" "}
            Creating workspace…
          </>
        ) : (
          <>
            Create account
            <ArrowRight data-icon="inline-end" />
          </>
        )}
      </Button>
    </form>
  );
}
