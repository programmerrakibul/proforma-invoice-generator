import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listCustomersAction } from "@/features/customers/actions/customer-actions";
import Link from "next/link";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
const first = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

export default async function CustomersPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = first(params.search).trim();
  const sort =
    first(params.sort) === "name" || first(params.sort) === "oldest"
      ? (first(params.sort) as "name" | "oldest")
      : "newest";
  const filter =
    first(params.filter) === "email" || first(params.filter) === "phone"
      ? (first(params.filter) as "email" | "phone")
      : "all";
  const pageNumber = Number(first(params.page));
  const result = await listCustomersAction({
    search,
    sort,
    filter,
    page: Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1,
    pageSize: 10,
  });
  return (
    <section className="p-6 lg:p-10">
      <header className="mb-7 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Customers</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage customers available for invoices.
          </p>
        </div>
        <Link href="/customers/new" className={buttonVariants()}>
          Add customer
        </Link>
      </header>
      <form className="mb-5 grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-4">
        <Input
          name="search"
          defaultValue={search}
          placeholder="Search customers"
        />
        <select
          name="filter"
          defaultValue={filter}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All fields</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
        <select
          name="sort"
          defaultValue={sort}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name</option>
        </select>
        <button className={buttonVariants({ variant: "secondary" })}>
          Apply
        </button>
      </form>
      {result.ok ? (
        <>
          <div className="mb-3 text-xs text-muted-foreground">
            {result.data.total} customers · Page {result.data.page} of{" "}
            {Math.max(1, result.data.totalPages)}
          </div>
          <div className="overflow-hidden rounded-xl border bg-card">
            {result.data.items.map((customer) => (
              <article
                key={customer.id}
                className="grid gap-1 border-b p-4 last:border-0 sm:grid-cols-3"
              >
                <strong>{customer.name}</strong>
                <span className="text-sm text-muted-foreground">
                  {customer.address}
                </span>
                <span className="text-sm text-muted-foreground">
                  {customer.email ?? ""} {customer.phone ?? ""}
                </span>
              </article>
            ))}
            {!result.data.items.length ? (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No customers found.
              </p>
            ) : null}
          </div>
          <nav className="mt-4 flex justify-end gap-3 text-sm">
            {result.data.page > 1 ? (
              <Link
                href={`?search=${encodeURIComponent(search)}&filter=${filter}&sort=${sort}&page=${result.data.page - 1}`}
              >
                Previous
              </Link>
            ) : null}
            {result.data.page < result.data.totalPages ? (
              <Link
                href={`?search=${encodeURIComponent(search)}&filter=${filter}&sort=${sort}&page=${result.data.page + 1}`}
              >
                Next
              </Link>
            ) : null}
          </nav>
        </>
      ) : (
        <p role="alert">{result.message}</p>
      )}
    </section>
  );
}
