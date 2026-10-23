import { AuthPage } from "@/features/auth/components/auth-page";
import { LoginForm } from "@/features/auth/components/login-form";
import { getSafeAuthRedirect } from "@/features/auth/utils/auth-redirect";
import type { JSX } from "react";

type SearchParamValue = string | string[] | undefined;

interface LoginPageProps {
  searchParams: Promise<Record<string, SearchParamValue>>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps): Promise<JSX.Element> {
  const params = await searchParams;
  const redirect = Array.isArray(params.redirect)
    ? params.redirect[0]
    : params.redirect;
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
