"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function PageHeader({
  title,
  breadcrumb,
}: {
  title: string;
  breadcrumb: { label: string; href: string }[];
}) {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop() ?? "";

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border bg-background px-6 py-4 sticky top-0 z-10">
      <div className="flex flex-col gap-1">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          {breadcrumb.map((crumb, index) => {
            const isLast = index === breadcrumb.length - 1;
            return (
              <Fragment key={crumb.href}>
                {isLast ? (
                  <span className="text-foreground">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
                {!isLast && <span className="mx-1">/</span>}
              </Fragment>
            );
          })}
          {breadcrumb.length > 0 && (
            <span className="mx-1 text-foreground">{lastSegment}</span>
          )}
        </nav>
        <h1 className=" font-semibold text-ink text-sm md:text-base tracking-tight">
          {title}
        </h1>
      </div>
    </div>
  );
}
