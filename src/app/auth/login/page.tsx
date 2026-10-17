"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAuthClient } from "better-auth/client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address.")
    .trim()
    .toLowerCase(),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const client = createAuthClient();

export default function LoginPage() {
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    criteriaMode: "all",
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await client.signIn.email({
        email: values.email,
        password: values.password,
      });
      toast.add({
        title: "Welcome back",
        description: "You are now signed in.",
      });
    } catch (e: unknown) {
      toast.add({
        title: "Login failed",
        description: (e as Error)?.message ?? "Invalid email or password.",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="font-serif font-bold text-ink text-2xl tracking-tight">
            Sign in
          </h1>
          <p className="text-sm text-muted-foreground">
            Access your M.M FABRICS invoice dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errors.root && (
            <Alert variant="destructive">
              <AlertTitle>Login failed</AlertTitle>
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
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
                <p className="text-xs text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...methods.register("password")}
                className={cn(
                  "h-10 px-3 py-2 text-sm",
                  errors.password && "border-destructive",
                )}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
