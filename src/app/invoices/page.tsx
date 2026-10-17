import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { listInvoicesAction } from "@/features/invoices/actions/list-invoices";
import Link from "next/link";

type BadgeVariant =
  | "default"
  | "secondary"
  | "link"
  | "outline"
  | "ghost"
  | "destructive";

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  ready: "Ready",
  exported: "Exported",
  archived: "Archived",
};

const STATUS_VARIANTS: Record<
  "draft" | "ready" | "exported" | "archived",
  BadgeVariant
> = {
  draft: "outline",
  ready: "default",
  exported: "secondary",
  archived: "ghost",
};

type PageParams = {
  searchParams?: {
    page?: string;
    search?: string;
    status?: string;
    sort?: string;
  };
};

function buildQueryString(params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, value);
    }
  }
  return searchParams.toString();
}

function pageRange(current: number, total: number): (number | "dots")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const result: (number | "dots")[] = [];
  const push = (value: number | "dots") => {
    if (result.length === 0 || result[result.length - 1] !== value) {
      result.push(value);
    }
  };

  push(1);

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) push("dots");
  for (let i = start; i <= end; i += 1) push(i);
  if (end < total - 1) push("dots");

  push(total);

  return result;
}

export default async function InvoicesPage({ searchParams }: PageParams) {
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search ?? "";
  const status = searchParams?.status ?? "all";
  const sort = searchParams?.sort ?? "newest";

  const baseParams: Record<string, string | undefined> = {
    search,
    status,
    sort,
  };

  const result = await listInvoicesAction({
    page,
    pageSize: 10,
    search,
    status,
    sort,
  });

  if (!result.ok) {
    return (
      <div className="px-6 py-24 lg:px-8 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="font-serif font-bold text-ink text-lg tracking-tight">
            Could not load invoices
          </h2>
          <p className="text-muted-foreground mt-2">{result.message}</p>
        </div>
      </div>
    );
  }

  const { items, totalPages } = result.data;

  return (
    <div className="px-6 py-20 lg:px-8 lg:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-serif font-bold text-ink text-3xl tracking-tight">
              Invoices
            </h1>
            <p className="text-muted-foreground">
              Manage your proforma invoices.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/invoices/new">
              <Button>New invoice</Button>
            </Link>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Search & filters */}
        <form
          method="GET"
          className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8"
        >
          <div className="md:col-span-8 relative">
            <Input
              name="search"
              defaultValue={search}
              placeholder="Search invoice number or buyer…"
              className="h-10 pl-10 pr-4"
            />
          </div>
          <div className="md:col-span-3">
            <select
              name="status"
              defaultValue={status}
              className="h-10 w-full rounded-md border border-input bg-input/20 px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="ready">Ready</option>
              <option value="exported">Exported</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="md:col-span-1">
            <Button type="submit" className="w-full h-10">
              Apply
            </Button>
          </div>
          {search && (
            <div className="md:col-span-12 pt-2">
              <Link
                href={`/?${buildQueryString({
                  ...baseParams,
                  search: undefined,
                })}`}
                className="text-xs text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Clear filters
              </Link>
            </div>
          )}
        </form>

        {/* Invoices grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {items.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground text-sm">
                No invoices found{search ? ` for "${search}"` : ""}.
              </p>
              {search && (
                <Link
                  href={`/?${buildQueryString({
                    ...baseParams,
                    search: undefined,
                  })}`}
                  className="mt-4 text-xs text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Clear filters
                </Link>
              )}
            </div>
          ) : (
            items.map((invoice) => (
              <Card key={invoice.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-serif font-semibold">
                      {invoice.invoiceNumber}
                    </CardTitle>
                    <Badge
                      variant={
                        STATUS_VARIANTS[invoice.status] ?? STATUS_VARIANTS.draft
                      }
                    >
                      {STATUS_LABELS[invoice.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Buyer</span>
                    <span className="text-foreground font-medium">
                      {invoice.buyerName}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Issue date</span>
                    <span className="text-foreground">
                      {new Date(invoice.issueDate).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-serif font-medium text-ink border-t border-border pt-3">
                    <span>Total</span>
                    <span>
                      {invoice.currency} {invoice.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Link href={`/invoices/${invoice.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Open invoice
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center">
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <PaginationPrevious
                    href={`/?${buildQueryString({
                      ...baseParams,
                      page: String(page - 1),
                    })}`}
                  />
                )}
                {pageRange(page, totalPages).map((item) => {
                  if (item === "dots") {
                    return (
                      <PaginationItem key="dots">
                        <span className="flex size-7 items-center justify-center text-muted-foreground" />
                      </PaginationItem>
                    );
                  }
                  const isActive = item === page;
                  return (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href={`/?${buildQueryString({
                          ...baseParams,
                          page: String(item),
                        })}`}
                        isActive={isActive}
                        aria-label={isActive ? "Current page" : undefined}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                {page < totalPages && (
                  <PaginationNext
                    href={`/?${buildQueryString({
                      ...baseParams,
                      page: String(page + 1),
                    })}`}
                  />
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
