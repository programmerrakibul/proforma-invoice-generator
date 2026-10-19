import { AuthPage } from "@/features/auth/components/auth-page";
import { LoginForm } from "@/features/auth/components/login-form";
import { getSafeAuthRedirect } from "@/features/auth/utils/auth-redirect";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;
  return (
    <AuthPage
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      description="Pick up where you left off and keep every invoice moving."
      footerText="New to M.M FABRICS?"
      footerHref="/auth/register"
      footerLinkText="Create an account"
    >
      <LoginForm redirectTo={getSafeAuthRedirect(redirect)} />
    </AuthPage>
  );
}
