import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireUser } from "@/lib/auth/require-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <DashboardShell>{children}</DashboardShell>;
}
