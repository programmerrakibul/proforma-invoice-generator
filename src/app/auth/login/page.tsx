"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    criteriaMode: "all",
  });

  const { handleSubmit, formState: { errors, isSubmitting } } = methods;

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.add({
          title: "Login failed",
          description: result.error,
        });
        return;
      }

      toast.add({ title: "Welcome back", description: "You are now signed in." });
    } catch {
      toast.add({
        title: "Login failed",
        description: "An unexpected error occurred.",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="font-serif font-bold text-ink text-2xl tracking-tight">Sign in</h1>
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
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
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
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
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

          <Separator className="my-4">
            Or continue with
          </Separator>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-10" onClick={() => {}}>
              <span className="flex items-center justify-center gap-2">
                <span className="shrink-0 rounded-md border border-border flex size-5 items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.62 3.52-4.03 3.52-6.72z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.19v2.77c3.04 2.45 7.2 4.01 12.04 4.01z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s0-1.43.2-2.09H2.19v2.77c0 .47.02.94.05 1.4H1.94C.65 17.69.2 14.99.2 12c0-3.04.54-5.89 1.66-8.48l2.23-1.74C4.66 5.16 2.93 8.07 2.38 11.46H.2c0 3.42 1.14 6.61 3.12 8.96zm10.32-6.27c-1.17 0-2.14-.78-2.42-1.84h-3.18v-1.84h3.11c.17-.54.55-.94 1.12-.94 1.16 0 2.11.78 2.42 1.84h3.2v1.84zm.14-1.84h-1.97c-.1-.3-.26-.55-.46-.75h2.43c.08.28.14.56.14.84 0 .28-.06.5-.14.84z" fill="#FBBC04" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.43 2.14 14.95 1 12 1 7.17 1 4.06 4.16 2.19 8.48l2.81 2.19C6.67 9.55 9.07 7.38 12 7.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.43 5.94 14.95 4.83 12 4.83z" fill="#EA4335" />
                  </svg>
                </span>
                Google
              </span>
            </Button>
            <Button variant="outline" className="h-10" onClick={() => {}}>
              <span className="flex items-center justify-center gap-2">
                <span className="shrink-0 rounded-md border border-border flex size-5 items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.16C3.16 2.16 2.28 3.04 2.28 3.04s-.91 1.47-.91 3.33 2.66 4.34 6.63 4.34 6.63-1.58 6.63-4.34 0-1.87-.91-3.33c.01-.01-.88-.88-.88-.88zm10 7.33c-.03.42-.17.79-.35 1.08-.18.27-.43.48-.72.61-.48.21-1.05.3-1.58.33-.47.02-1.05-.1-1.58-.33-.29-.14-.54-.34-.72-.61-.18-.29-.32-.66-.35-1.08 0-.24 0-.47.01-.71-.02-.68-.05-1.34-.13-1.98-.08-.67-.23-1.31-.42-1.91-.17-.52-.4-1-0.66-1.44-.28-.47-.61-.88-1.01-1.21-.56-.47-1.23-.78-1.94-.88-.7-.1-1.42-.09-2.13-.09-.72 0-1.44 0-2.13.09-.71.09-1.38.41-1.94.88-.4.33-.73.74-1.01 1.21-.26.44-.49.92-.66 1.44-.19.6-.34 1.24-.42 1.91-.08.64-.1 1.3-.13 1.98 0 .24.01.47.01.71zM6.38 10.48C5.06 9.01 4 7.5 4 5.92 4 4.39 5.22 3 6.55 3c1.35 0 2.59.91 2.98 2.14.39 1.27-.41 2.53-1.67 2.91-.92.28-1.75.7-2.47 1.39-.42.4-.69.91-.87 1.49-.19.58-.17 1.21-.08 1.81l2.49-2.1c-.3-.26-.51-.56-.64-.88zm9.33-.23c-1.12-.99-2.24-1.58-3.5-1.58s-2.38.59-3.5 1.58c-.31.27-.51.57-.64.88l2.49 2.1c.09-.6.1-1.23-.08-1.81-.18-.58-.45-1.09-.87-1.49-.72-.69-1.55-1.11-2.47-1.39-1.26-.38-2.06-1.64-1.67-2.91.39-1.27 1.63-2.14 2.98-2.14 1.33 0 2.55 1.39 2.55 2.92 0 1.58-1.06 3.09-2.38 4.56-.13.32-.34.62-.64.88zm1.12 7.21c0 .24-.01.47-.01.71-.02.68-.05 1.34-.13 1.98-.08.67-.23 1.31-.42 1.91-.17.52-.4 1-0.66 1.44-.28.47-.61.88-1.01 1.21-.56.47-1.23.78-1.94.88-.7.1-1.42.09-2.13.09s-1.42 0-2.13-.09c-.71-.09-1.38-.41-1.94-.88-.4-.33-.73-.74-1.01-1.21-.26-.44-.49-.92-.66-1.44-.19-.6-.34-1.24-.42-1.91-.08-.64-.1-1.3-.13-1.98 0-.24.01-.47.01-.71l2.49-2.1c-.3-.26-.51-.56-.64-.88-1.12-.99-2.24-1.58-3.5-1.58s-2.38.59-3.5 1.58c-.13.32-.34.62-.64.88L6.16 17.7c.09-.6.1-1.23-.08-1.81-.18-.58-.45-1.09-.87-1.49-.72-.69-1.55-1.11-2.47-1.39-1.26-.38-2.06-1.64-1.67-2.91.39-1.27 1.63-2.14 2.98-2.14 1.35 0 2.59.91 2.98 2.14.39 1.27-.41 2.53-1.67 2.91-.92.28-1.75.7-2.47 1.39-.42.4-.69.91-.87 1.49-.19.58-.17 1.21-.08 1.81l2.49-2.1c-.3-.26-.51-.56-.64-.88-1.12-.99-2.24-1.58-3.5-1.58s-2.38.59-3.5 1.58c-.13.32-.34.62-.64.88l2.49 2.1c.09-.6.1-1.23-.08-1.81-.18-.58-.45-1.09-.87-1.49-.72-.69-1.55-1.11-2.47-1.39-1.26-.38-2.06-1.64-1.67-2.91 1.33 0 2.55-1.39 2.55-2.92 0-1.58-1.06-3.09-2.38-4.56-.13-.32-.34-.62-.64-.88z" />
                  </svg>
                </span>
                GitHub
              </span>
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
