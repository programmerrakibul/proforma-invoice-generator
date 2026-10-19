import logoImage from "@/assets/logo.png";
import { buttonVariants } from "@/components/ui/button";
import type { User } from "@/lib/auth";
import { ArrowUpRight, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Container from "../shared/container";

interface SiteHeaderProps {
  user: User | null;
}

const NAVIGATION = [
  { href: "/", label: "Home" },
  { href: "/invoices/new", label: "Create invoice" },
  { href: "/invoices", label: "Invoice list", authenticated: true },
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
];

export function SiteHeader({ user }: SiteHeaderProps) {
  const initials = user?.name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <Container className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="M.M FABRICS home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold tracking-tight text-primary-foreground shadow-sm">
            <Image
              src={logoImage.src}
              alt="M.M FABRICS"
              width={150}
              height={150}
            />
          </span>
          <span className="text-sm font-semibold tracking-[0.16em]">
            M.M FABRICS
          </span>
        </Link>
        <nav
          className="hidden items-center gap-5 lg:flex"
          aria-label="Main navigation"
        >
          {NAVIGATION.filter((item) => !item.authenticated || user).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex justify-end">
          {user ? (
            <Link
              href="/invoices"
              aria-label={`Signed in as ${user.name || user.email}`}
              title={user.name || user.email}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-foreground"
            >
              {initials || <UserRound className="size-4" />}
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className={buttonVariants({
                size: "sm",
                className: "rounded-full px-4",
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
