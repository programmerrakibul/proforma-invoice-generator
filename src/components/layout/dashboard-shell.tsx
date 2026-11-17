"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { cn } from "@/lib/utils";
import type { RootState } from "@/store/index";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { SiteHeader } from "./site-header";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const isSidebarOpen = useSelector(
    (state: RootState) => state.invoiceUi.isSidebarOpen,
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20">
      <SiteHeader />
      <AppSidebar />
      <main
        className={cn(
          "min-h-[calc(100vh-4rem)] lg:pl-60",
          isSidebarOpen ? "md:pl-60" : "md:pl-16",
        )}
      >
        {children}
      </main>
    </div>
  );
}
