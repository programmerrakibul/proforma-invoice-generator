"use client";

import { AuthPage } from "@/features/auth/components/auth-page";
import { RegisterForm } from "@/features/auth/components/register-form";
import { getSafeAuthRedirect } from "@/features/auth/utils/auth-redirect";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const destination = getSafeAuthRedirect(redirect ?? "/invoices");

  return (
    <AuthPage
      eyebrow="A clearer way to work"
      title="Create your workspace"
      description="Bring your proforma invoices, drafts, and client details into one focused space."
      footerText="Already have an account?"
      footerHref={`/auth/login?redirect=${encodeURIComponent(destination)}`}
      footerLinkText="Sign in"
    >
      <RegisterForm redirectTo={destination} />
    </AuthPage>
  );
}
