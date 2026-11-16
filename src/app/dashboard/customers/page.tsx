import { listCustomersAction } from "@/features/customers/actions/customer-actions";
import { CustomerList } from "@/features/customers/components/customer-list";
import {
  readEnumSearchParam,
  readPositiveInteger,
  readSearchParam,
  type SearchParamsRecord,
} from "@/lib/utils/list-query";

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

  return (
    <section className="min-w-0 p-4 sm:p-6 lg:p-10">
      {result.ok ? (
        <CustomerList customers={result.data} query={query} />
      ) : (
        <>
          <h1 className="mb-6 text-3xl font-semibold">Customers</h1>
          <p role="alert">{result.message}</p>
        </>
      )}
    </section>
  );
}
