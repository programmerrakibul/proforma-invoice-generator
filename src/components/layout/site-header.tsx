"use client";

import logoImage from "@/assets/logo.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { companyProfile } from "@/data/company";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { useSession } from "@/lib/auth-client";
import { ArrowUpRight, PlusIcon, ReceiptText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Container from "../shared/container";
import { Spinner } from "../ui/spinner";
import { MobileNavigation } from "./mobile-navigation";

export function SiteHeader() {
  const { data, isPending } = useSession();
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
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
            {companyProfile.companyName}
          </span>
        </Link>
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 lg:col-start-3">
          <div className="md:hidden">
            <MobileNavigation />
          </div>
          {isPending ? (
            <>
              <Spinner />
            </>
          ) : user ? (
            <Popover open={accountMenuOpen} onOpenChange={setAccountMenuOpen}>
              <PopoverTrigger
                aria-label={`Open account menu for ${user.name || user.email}`}
                render={
                  <button
                    type="button"
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                }
              >
                <Avatar
                  size="lg"
                  className="border border-border bg-muted text-sm font-semibold text-foreground"
                >
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent align="end" sideOffset={10} className="w-72 p-2">
                <Card className="gap-0">
                  <CardHeader className="px-3 py-3">
                    <CardTitle>{user.name || "Account"}</CardTitle>
                    <CardDescription className="break-all">
                      {user.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1 px-2 pb-2">
                    <Link
                      href="/dashboard/invoices/new"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <PlusIcon aria-hidden="true" />
                      Create Invoice
                    </Link>
                    <Link
                      href="/dashboard/invoices"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <ReceiptText aria-hidden="true" />
                      Invoice list
                    </Link>
                  </CardContent>
                  <CardFooter className="border-t px-3 py-3">
                    <div className="w-full">
                      <LogoutButton
                        onLoggedOut={() => setAccountMenuOpen(false)}
                      />
                    </div>
                  </CardFooter>
                </Card>
              </PopoverContent>
            </Popover>
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
