"use client";

import { Button } from "@/components/ui/button";
import { companyProfile } from "@/data/company";
import { setIsSidebarOpen } from "@/features/invoices/store/invoice-ui.slice";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RootState } from "@/store/index";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export function MobileNav() {
  const isSidebarOpen = useSelector(
    (state: RootState) => state.invoiceUi.isSidebarOpen
  );
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTabletCollapsed = useMediaQuery(
    "(min-width: 768px) and (max-width: 1023px)"
  );

  if (!isMobile && !isTabletCollapsed) return null;

  return (
    <div
      className={[
        "fixed top-0 left-0 right-0 z-30 border-b border-border bg-background flex items-center justify-between px-4 h-12",
        isTabletCollapsed ? "pl-16" : "",
      ].join(" ")}
    >
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(setIsSidebarOpen(!isSidebarOpen))}
          aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
        >
          {isSidebarOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </Button>
      )}
      <div className="flex items-center gap-1">
        <span className=" font-bold text-ink text-xs">
          {companyProfile.companyName}
        </span>
      </div>
    </div>
  );
}
