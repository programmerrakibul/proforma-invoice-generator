import logoImage from "@/assets/logo.png";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Container from "../shared/container";

interface SiteHeaderProps {
  backToHome?: boolean;
  navigation?: Array<{ href: string; label: string }>;
  actionLabel?: string;
  actionHref?: string;
}

export function SiteHeader({
  backToHome = false,
  navigation = [],
  actionLabel = "Create invoice",
  actionHref = "/invoices/new",
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
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
        {backToHome ? (
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft data-icon="inline-start" /> Back to home
          </Link>
        ) : (
          <>
            <nav
              className="hidden items-center gap-8 md:flex"
              aria-label="Main navigation"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                Sign in
              </Link>
              <Link
                href={actionHref}
                className={buttonVariants({
                  size: "sm",
                  className: "rounded-full px-4",
                })}
              >
                {actionLabel}
                <ArrowUpRight data-icon="inline-end" />
              </Link>
            </div>
          </>
        )}
      </Container>
    </header>
  );
}
