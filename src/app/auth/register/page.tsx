"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/toast";
import { registerUserAction } from "@/features/auth/actions/register";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required.").trim(),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .trim()
    .toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(1, "Please confirm your password."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    criteriaMode: "all",
  });

  const { handleSubmit, formState: { errors, isSubmitting } } = methods;

  const onSubmit = async (values: RegisterFormValues) => {
    const result = await registerUserAction({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (result.ok) {
      toast.add({ title: "Account created", description: result.message });
    } else {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          const typedField = field as keyof RegisterFormValues;
          methods.setError(typedField, {
            type: "server",
            message: messages.join(", "),
          });
        }
      } else {
        toast.add({ title: "Registration failed", description: result.message });
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="font-serif font-bold text-ink text-2xl tracking-tight">Create account</h1>
          <p className="text-sm text-muted-foreground">
            Join M.M FABRICS to manage your proforma invoices.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errors.root && (
            <Alert variant="destructive">
              <AlertTitle>Registration failed</AlertTitle>
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...methods.register("name")}
                className={cn(
                  "h-10 px-3 py-2 text-sm",
                  errors.name && "border-destructive",
                )}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                {...methods.register("email")}
                className={cn(
                  "h-10 px-3 py-2 text-sm",
                  errors.email && "border-destructive",
                )}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...methods.register("password")}
                className={cn(
                  "h-10 px-3 py-2 text-sm",
                  errors.password && "border-destructive",
                )}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...methods.register("confirmPassword")}
                className={cn(
                  "h-10 px-3 py-2 text-sm",
                  errors.confirmPassword && "border-destructive",
                )}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
