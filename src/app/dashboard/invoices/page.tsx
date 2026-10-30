import Container from "@/components/shared/container";
import { ListToolbar } from "@/components/shared/list-toolbar";
import { buttonVariants } from "@/components/ui/button";
import { listInvoicesAction } from "@/features/invoices/actions/list-invoices";
import { InvoiceListTable } from "@/features/invoices/components/invoice-list-table";
import { FilePlus2 } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import {
  readEnumSearchParam,
  readPositiveInteger,
  readSearchParam,
  type SearchParamsRecord,
} from "@/lib/utils/list-query";

type InvoiceStatusFilter = "all" | "draft" | "exported";
type InvoiceSort = "newest" | "oldest" | "highest" | "lowest";
interface InvoicesPageProps {
  searchParams: Promise<SearchParamsRecord>;
}

export default async function InvoicesPage({
  searchParams,
}: InvoicesPageProps) {
  await connection();
  const params = await searchParams;
  const page = readPositiveInteger(params.page);
  const search = readSearchParam(params.search).trim();
  const status: InvoiceStatusFilter = readEnumSearchParam(
    params.status,
    ["all", "draft", "exported"],
    "all",
  );
  const sort: InvoiceSort = readEnumSearchParam(
    params.sort,
    ["newest", "oldest", "highest", "lowest"],
    "newest",
  );
  const query = { search, status, sort };
  const result = await listInvoicesAction({ page, pageSize: 12, ...query });



  return (
    <section className="min-w-0 py-6 sm:py-10 lg:py-14">
      <Container>
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
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
            href="/dashboard/invoices/new"
            className={buttonVariants({
              className: "w-full rounded-full px-4 sm:w-auto",
            })}
          >
            <FilePlus2 data-icon="inline-start" /> New invoice
          </Link>
        </header>
        <ListToolbar
          key={`${search}:${status}:${sort}`}
          action="/dashboard/invoices"
          search={search}
          searchPlaceholder="Search PI number or buyer"
          controls={[
            {
              name: "status",
              label: "Filter by status",
              value: status,
              options: [
                { value: "all", label: "All statuses" },
                { value: "draft", label: "Draft" },
                { value: "exported", label: "Exported" },
              ],
            },
            {
              name: "sort",
              label: "Sort invoices",
              value: sort,
              options: [
                { value: "newest", label: "Recently updated" },
                { value: "oldest", label: "Oldest updated" },
                { value: "highest", label: "Highest amount" },
                { value: "lowest", label: "Lowest amount" },
              ],
            },
          ]}
        />
        {result.ok ? (
          result.data.items.length > 0 ? (
            <InvoiceListTable
              items={result.data.items}
              page={result.data.page}
              pageSize={result.data.pageSize}
              total={result.data.total}
              query={query}
            />
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
              <Link
                href="/dashboard/invoices/new"
                className={`${buttonVariants()} mt-5 rounded-full`}
              >
                <FilePlus2 data-icon="inline-start" /> Create invoice
              </Link>
            </div>
          )
        ) : (
          <div
            role="alert"
            className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive"
          >
            {result.message}
          </div>
        )}
      </Container>
    </section>
  );
}
