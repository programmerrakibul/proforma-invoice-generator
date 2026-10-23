"use client";

import { AuthPage } from "@/features/auth/components/auth-page";
import { LoginForm } from "@/features/auth/components/login-form";
import { getSafeAuthRedirect } from "@/features/auth/utils/auth-redirect";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const destination = getSafeAuthRedirect(redirect ?? "/invoices");

  return (
    <AuthPage
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      description="Pick up where you left off and keep every invoice moving."
      footerText="New to M.M FABRICS?"
      footerHref="/auth/register"
      footerLinkText="Create an account"
    >
      <LoginForm redirectTo={destination} />
    </AuthPage>
  );
}
