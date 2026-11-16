"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { useSession } from "@/lib/auth-client";
import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const NAVIGATION = [
  { href: "/dashboard/invoices", label: "Invoice List", authenticated: true },
  {
    href: "/dashboard/invoices/new",
    label: "Create Invoice",
    authenticated: true,
  },
  { href: "/dashboard/customers", label: "Customers", authenticated: true },
];

export function MobileNavigation() {
  const { data } = useSession();
  const user = data?.user;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open navigation menu"
        render={
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        }
      >
        <Menu className="size-4" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[min(20rem,calc(100vw-2rem))] p-0 sm:max-w-sm"
      >
        <SheetHeader className="border-b border-border px-5 py-5">
          <SheetTitle className="text-left text-base">M.M FABRICS</SheetTitle>
          <SheetDescription className="text-left">
            Navigate the invoice workspace
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-3" aria-label="Mobile navigation">
          {NAVIGATION.filter((item) => !item.authenticated || user).map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="mt-auto border-t border-border p-4">
          {!user ? (
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className={buttonVariants({
                className: "w-full justify-center rounded-full",
              })}
            >
              <span>Login</span>
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          ) : (
            <LogoutButton compact={false} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
