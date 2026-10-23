import { AuthPage } from "@/features/auth/components/auth-page";
import { RegisterForm } from "@/features/auth/components/register-form";
import { getSafeAuthRedirect } from "@/features/auth/utils/auth-redirect";
import type { JSX } from "react";

type SearchParamValue = string | string[] | undefined;

interface RegisterPageProps {
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps): Promise<JSX.Element> {
  const params = await searchParams;
  const redirect = Array.isArray(params.redirect)
    ? params.redirect[0]
    : params.redirect;
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
