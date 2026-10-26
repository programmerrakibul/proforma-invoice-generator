import Container from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[65vh] items-center py-16 sm:py-24">
      <Container>
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="mb-7 flex size-16 items-center justify-center rounded-2xl border border-border/70 bg-card text-primary shadow-sm">
            <FileQuestion aria-hidden="true" className="size-7" />
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Error 404
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            We can’t find that page
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            The link may be outdated, or the page may have moved. Head back to a
            familiar place and continue working on your invoices.
          </p>
          <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Link href="/" className={buttonVariants({ className: "h-10 rounded-full px-5" })}>
              Home
              <ArrowRight data-icon="inline-end" />
            </Link>
            <Link href="/dashboard/invoices/new" className={buttonVariants({ variant: "secondary", className: "h-10 rounded-full px-5" })}>
              Create invoice
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
