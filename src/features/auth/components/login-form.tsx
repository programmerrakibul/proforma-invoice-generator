"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AuthField } from "@/features/auth/components/auth-field";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/auth.schema";
import { signIn } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface LoginFormProps {
  redirectTo: string;
}

export function LoginForm({
  redirectTo = "/dashboard/invoices",
}: LoginFormProps) {
  const [isRedirecting, startTransition] = useTransition();

  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });
  const isLoading = isSubmitting || isRedirecting;

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    setServerError(null);
    try {
      const result = await signIn.email({
        ...values,
      });

      if (result.error) {
        throw new Error(
          result.error.message ??
            "Check your email and password, then try again."
        );
      }

      toast.success("Welcome back", {
        description: "You are signed in and ready to go.",
      });

      startTransition(() => {
        router.replace(redirectTo);
        router.refresh();
      });
    } catch (error: unknown) {
      setServerError(
        error instanceof Error
          ? error.message
          : "We couldn’t sign you in. Please try again."
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
          <AlertTitle>Sign in failed</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      ) : null}

      <AuthField
        id="email"
        label="Work email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        disabled={isLoading}
        error={errors.email?.message}
        {...register("email")}
      />

      <AuthField
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        disabled={isLoading}
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-1 h-11 w-full rounded-xl text-sm font-semibold shadow-md shadow-primary/15"
      >
        {isLoading ? (
          <>
            <LoaderCircle className="animate-spin" data-icon="inline-start" />{" "}
            {isRedirecting ? "Redirecting…" : "Signing in…"}
          </>
        ) : (
          <>
            Sign in securely
            <ArrowRight data-icon="inline-end" />
          </>
        )}
      </Button>
    </form>
  );
}
