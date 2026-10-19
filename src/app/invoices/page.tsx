import Container from "@/components/shared/container";
import { Button, buttonVariants } from "@/components/ui/button";
import { listInvoicesAction } from "@/features/invoices/actions/list-invoices";
import { InvoiceListTable } from "@/features/invoices/components/invoice-list-table";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { ArrowLeft, ArrowRight, FilePlus2, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";

type SearchParamValue = string | string[] | undefined;
type InvoiceStatusFilter = "all" | "draft" | "ready" | "exported" | "archived";
type InvoiceSort = "newest" | "oldest" | "highest" | "lowest";
interface InvoicesPageProps {
  searchParams: Promise<Record<string, SearchParamValue>>;
}

function firstParam(value: SearchParamValue): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function buildQueryString(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(key, value);
  }
  return query.toString();
}

function parseStatus(value: string): InvoiceStatusFilter {
  switch (value) {
    case "draft":
    case "ready":
    case "exported":
    case "archived":
      return value;
    default:
      return "all";
  }
}

function parseSort(value: string): InvoiceSort {
  switch (value) {
    case "oldest":
    case "highest":
    case "lowest":
      return value;
    default:
      return "newest";
  }
}

export default async function InvoicesPage({
  searchParams,
}: InvoicesPageProps) {
  await connection();
  const params = await searchParams;
  const user = await getCurrentUser();

  if (!user) redirect("/auth/login?redirect=%2Finvoices");

  const pageValue = Number.parseInt(firstParam(params.page), 10);
  const page = Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1;
  const search = firstParam(params.search).trim();
  const status = parseStatus(firstParam(params.status));
  const sort = parseSort(firstParam(params.sort));
  const queryParams = { search, status, sort };

  const result = await listInvoicesAction({
    page,
    pageSize: 25,
    search,
    status,
    sort,
  });

  return (
    <Container className="py-10 lg:py-14">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Workspace
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Invoices</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Search, preview, and manage your proforma invoices.
            </p>
          </div>
          <Link
            href="/invoices/new"
            className={buttonVariants({ className: "rounded-full px-4" })}
          >
            <FilePlus2 data-icon="inline-start" /> New invoice
          </Link>
        </div>

        <form
          method="GET"
          action="/invoices"
          className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm md:grid-cols-[minmax(16rem,1fr)_12rem_12rem_auto]"
        >
          <label className="relative flex items-center">
            <Search className="absolute left-3 size-4 text-muted-foreground" />
            <input
              name="search"
              defaultValue={search}
              placeholder="Search PI number or buyer"
              className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            />
          </label>
          <select
            name="status"
            defaultValue={status}
            aria-label="Filter by status"
            className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="ready">Ready</option>
            <option value="exported">Exported</option>
            <option value="archived">Archived</option>
          </select>
          <select
            name="sort"
            defaultValue={sort}
            aria-label="Sort invoices"
            className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            <option value="newest">Recently updated</option>
            <option value="oldest">Oldest updated</option>
            <option value="highest">Highest amount</option>
            <option value="lowest">Lowest amount</option>
          </select>
          <Button
            type="submit"
            variant="secondary"
            className="h-10 rounded-xl px-5"
          >
            Apply
          </Button>
        </form>

        {result.ok ? (
          <>
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {result.data.total} invoice{result.data.total === 1 ? "" : "s"}
              </span>
              <span>
                Page {result.data.page} of {Math.max(result.data.totalPages, 1)}
              </span>
            </div>
            {result.data.items.length > 0 ? (
              <InvoiceListTable items={result.data.items} />
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/70 px-6 text-center">
                <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <FilePlus2 />
                </span>
                <h2 className="text-base font-semibold">
                  {search || status !== "all"
                    ? "No matching invoices"
                    : "Your invoice workspace is ready"}
                </h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  {search || status !== "all"
                    ? "Try changing your search or filters."
                    : "Create your first proforma invoice to see it here."}
                </p>
                {search || status !== "all" ? (
                  <Link
                    className="mt-4 text-sm font-medium text-primary hover:underline"
                    href={`/invoices?${buildQueryString({ sort })}`}
                  >
                    Clear filters
                  </Link>
                ) : (
                  <Link
                    href="/invoices/new"
                    className={`${buttonVariants()} mt-5 rounded-full`}
                  >
                    <FilePlus2 data-icon="inline-start" /> Create invoice
                  </Link>
                )}
              </div>
            )}
            {result.data.totalPages > 1 ? (
              <div className="mt-5 flex items-center justify-end gap-2">
                {page > 1 ? (
                  <Link
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                    href={`/invoices?${buildQueryString({ ...queryParams, page: String(page - 1) })}`}
                  >
                    <ArrowLeft data-icon="inline-start" /> Previous
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className={`${buttonVariants({ variant: "outline", size: "sm" })} pointer-events-none opacity-50`}
                  >
                    <ArrowLeft data-icon="inline-start" /> Previous
                  </span>
                )}
                {page < result.data.totalPages ? (
                  <Link
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                    href={`/invoices?${buildQueryString({ ...queryParams, page: String(page + 1) })}`}
                  >
                    Next <ArrowRight data-icon="inline-end" />
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className={`${buttonVariants({ variant: "outline", size: "sm" })} pointer-events-none opacity-50`}
                  >
                    Next <ArrowRight data-icon="inline-end" />
                  </span>
                )}
              </div>
            ) : null}
          </>
        ) : (
          <div
            role="alert"
            className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive"
          >
            {result.message}
          </div>
        )}
      </section>
    </Container>
  );
}
