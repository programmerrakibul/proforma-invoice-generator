import {
  ArrowLeft,
  Check,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthPageProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

const BENEFITS = [
  "A polished, ready-to-send document",
  "Live totals as you build each invoice",
  "Your drafts, organized and secure",
];

export function AuthPage({
  eyebrow,
  title,
  description,
  children,
}: AuthPageProps) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/30">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-16">
        <section className="relative hidden min-h-150 overflow-hidden rounded-[2rem] bg-primary p-10 text-primary-foreground shadow-xl lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 size-96 rounded-full border border-primary-foreground/15"
          />
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-12 size-72 rounded-full border border-primary-foreground/15"
          />
          <div className="relative flex items-center gap-3 text-sm font-medium text-primary-foreground/75">
            <Sparkles /> Designed for confident trade
          </div>
          <div className="relative max-w-lg">
            <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary-foreground/10">
              <FileText />
            </div>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight">
              Every detail, beautifully in order.
            </h2>
            <p className="mt-4 max-w-md leading-7 text-primary-foreground/75">
              Create clear, professional proforma invoices that keep your
              business moving.
            </p>
            <ul className="mt-8 flex flex-col gap-4">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary-foreground/15">
                    <Check className="size-3.5" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex items-center gap-2 text-xs text-primary-foreground/65">
            <ShieldCheck className="size-4" /> Private by design{" "}
            <span className="mx-1">·</span> Built for M.M FABRICS
          </div>
        </section>

        <section className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Back
          </Link>
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
