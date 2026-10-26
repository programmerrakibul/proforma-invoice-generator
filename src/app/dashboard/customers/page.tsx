import { ListToolbar } from "@/components/shared/list-toolbar";
import {
  ResponsiveDataTable,
  type DataTableColumn,
} from "@/components/shared/responsive-data-table";
import { buttonVariants } from "@/components/ui/button";
import {
  listCustomersAction,
  type CustomerListItem,
} from "@/features/customers/actions/customer-actions";
import {
  readEnumSearchParam,
  readPositiveInteger,
  readSearchParam,
  type SearchParamsRecord,
} from "@/lib/utils/list-query";
import Link from "next/link";

interface CustomersPageProps {
  searchParams: Promise<SearchParamsRecord>;
}

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  const params = await searchParams;
  const search = readSearchParam(params.search).trim();
  const sort = readEnumSearchParam(
    params.sort,
    ["name", "oldest", "newest"],
    "newest",
  );
  const filter = readEnumSearchParam(
    params.filter,
    ["email", "phone", "all"],
    "all",
  );
  const page = readPositiveInteger(params.page);
  const query: {
    search: string;
    filter: "all" | "email" | "phone";
    sort: "name" | "oldest" | "newest";
  } = { search, filter, sort };
  const result = await listCustomersAction({ ...query, page, pageSize: 10 });
  const columns: DataTableColumn<CustomerListItem>[] = [
    {
      id: "name",
      label: "Name",
      render: (customer) => <strong>{customer.name}</strong>,
    },
    {
      id: "address",
      label: "Address",
      render: (customer) => (
        <span className="whitespace-normal">{customer.address}</span>
      ),
    },
    {
      id: "contact",
      label: "Contact",
      render: (customer) => (
        <span className="block whitespace-normal">
          {[customer.email, customer.phone].filter(Boolean).join(" · ") || "—"}
        </span>
      ),
    },
  ];

  return (
    <section className="min-w-0 p-4 sm:p-6 lg:p-10">
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Customers</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage customers available for invoices.
          </p>
        </div>
        <Link
          href="/dashboard/customers/new"
          className={buttonVariants({ className: "w-full sm:w-auto" })}
        >
          Add customer
        </Link>
      </header>
      <ListToolbar
        key={`${search}:${filter}:${sort}`}
        action="/dashboard/customers"
        search={search}
        searchPlaceholder="Search customers"
        controls={[
          {
            name: "filter",
            label: "Filter fields",
            value: filter,
            options: [
              { value: "all", label: "All fields" },
              { value: "email", label: "Email" },
              { value: "phone", label: "Phone" },
            ],
          },
          {
            name: "sort",
            label: "Sort customers",
            value: sort,
            options: [
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
              { value: "name", label: "Name" },
            ],
          },
        ]}
      />
      {result.ok ? (
        <ResponsiveDataTable
          columns={columns}
          rows={result.data.items}
          getRowKey={(customer) => customer.id}
          emptyMessage={
            search || filter !== "all"
              ? "No matching customers."
              : "Add a customer to use it on invoices."
          }
          page={result.data.page}
          pageSize={result.data.pageSize}
          total={result.data.total}
          basePath="/dashboard/customers"
          query={query}
        />
      ) : (
        <p role="alert">{result.message}</p>
      )}
    </section>
  );
}
