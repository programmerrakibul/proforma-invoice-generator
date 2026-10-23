"use client";

import logoImage from "@/assets/logo.png";
import { buttonVariants } from "@/components/ui/button";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { useSession } from "@/lib/auth-client";
import { ArrowUpRight, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Container from "../shared/container";
import { Spinner } from "../ui/spinner";
import { MobileNavigation } from "./mobile-navigation";

const NAVIGATION = [
  { href: "/", label: "Home" },
  { href: "/invoices/new", label: "Create invoice" },
  { href: "/invoices", label: "Invoice list", authenticated: true },
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
];

export function SiteHeader() {
  const { data, isPending } = useSession();
  const user = data?.user;
  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <Container className="grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 sm:gap-3"
          aria-label="M.M FABRICS home"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold tracking-tight text-primary-foreground shadow-sm sm:size-9">
            <Image
              src={logoImage.src}
              alt="M.M FABRICS"
              width={36}
              height={36}
              className="size-full object-contain"
              loading="eager"
            />
          </span>
          <span className="truncate text-[11px] font-semibold tracking-[0.12em] sm:text-sm sm:tracking-[0.16em]">
            M.M FABRICS
          </span>
        </Link>
        <nav
          className="hidden items-center gap-4 xl:gap-5 lg:flex"
          aria-label="Main navigation"
        >
          {NAVIGATION.filter((item) => !item.authenticated || user).map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-xs text-muted-foreground transition-colors hover:text-foreground xl:text-sm"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 lg:col-start-3">
          <div className="lg:hidden">
            <MobileNavigation />
          </div>
          {isPending ? (
            <>
              <Spinner />
            </>
          ) : user ? (
            <>
              <Link
                href="/invoices"
                aria-label={`Signed in as ${user.name || user.email}`}
                title={user.name || user.email}
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-foreground sm:size-9"
              >
                {initials || <UserRound className="size-4" />}
              </Link>
              <div className="hidden lg:block">
                <LogoutButton compact />
              </div>
            </>
          ) : (
            <Link
              href="/auth/login"
              className={buttonVariants({
                size: "sm",
                className:
                  "h-8 rounded-full px-3 text-xs sm:h-9 sm:px-4 sm:text-sm",
              })}
            >
              Login
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
}
