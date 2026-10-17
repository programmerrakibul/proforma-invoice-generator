"use client";

import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RootState } from "@/store/index";
import { setIsSidebarOpen } from "@/features/invoices/store/invoice-ui.slice";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const NAVIGATION = [
  {
    href: "/(dashboard)/invoices",
    label: "Invoices",
    icon: FileText,
  },
  {
    href: "/(dashboard)/invoices/new",
    label: "New invoice",
    icon: LayoutDashboard,
  },
];

export function AppSidebar() {
  const isSidebarOpen = useSelector(
    (state: RootState) => state.invoiceUi.isSidebarOpen,
  );
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isTablet = useMediaQuery(
    "(min-width: 768px) and (max-width: 1023px)",
  );

  return (
    <aside
      className={[
        "fixed z-20 top-0 bottom-0 border-r border-border bg-background flex flex-col transition-all duration-300",
        isTablet && !isSidebarOpen
          ? "w-16 translate-x-0"
          : "w-60 translate-x-0",
        isTablet && !isSidebarOpen ? "md:hidden" : "",
      ].join(" ")}
      aria-label="Main navigation"
    >
      <div className="flex h-12 items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className=" font-bold text-ink tracking-tight text-xs md:text-sm">M.M</span>
          <span className=" font-bold text-ink tracking-tight text-xs md:text-sm">FABRICS</span>
        </div>
        {isTablet && !isSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(setIsSidebarOpen(true))}
            aria-label="Open navigation"
          >
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-2 pt-4">
        {NAVIGATION.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              ].join(" ")}
            >
              <Icon className="size-4 shrink-0" />
              {!isTablet || isSidebarOpen ? item.label : null}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => dispatch(setIsSidebarOpen(!isSidebarOpen))}
        >
          {isSidebarOpen ? "Collapse" : "Expand"}
        </Button>
      </div>
    </aside>
  );
}
