import { StoreProvider } from "@/store/provider";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar />
        <MobileNav />
        <div className="flex-1 flex flex-col lg:ml-60 xl:ml-60 overflow-hidden">
          {children}
        </div>
      </div>
    </StoreProvider>
  );
}
