import { AppSidebar } from "@/components/layout/app-sidebar";
import { requireUser } from "@/lib/auth/require-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20">
      <AppSidebar />
      <main className="min-h-[calc(100vh-4rem)] pt-12 md:pl-60">
        {children}
      </main>
    </div>
  );
}
