import { AuthPage } from "@/features/auth/components/auth-page";
import { RegisterForm } from "@/features/auth/components/register-form";
import { getSafeAuthRedirect } from "@/features/auth/utils/auth-redirect";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { redirect as navigate } from "next/navigation";

interface RegisterPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { redirect } = await searchParams;
  const destination = getSafeAuthRedirect(redirect);
  if (await getCurrentUser()) navigate(destination);

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
