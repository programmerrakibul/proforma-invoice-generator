import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { buildQueryString } from "@/lib/utils/list-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  id: string;
  label: string;
  render: (row: T) => ReactNode;
  className?: string;
  align?: "left" | "right";
}

interface ResponsiveDataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyMessage: string;
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  query: Record<string, string | undefined>;
}

export function ResponsiveDataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage,
  page,
  pageSize,
  total,
  basePath,
  query,
}: ResponsiveDataTableProps<T>) {
  const totalPages = Math.ceil(total / pageSize);
  const makeHref = (targetPage: number): string => {
    const queryString = buildQueryString({
      ...query,
      page: String(targetPage),
    });
    return queryString ? `${basePath}?${queryString}` : basePath;
  };
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

  return (
    <section className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {firstItem}–{lastItem} of {total}
        </span>
        <span>
          Page {page} of {Math.max(totalPages, 1)}
        </span>
      </div>
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card px-5 py-12 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm md:block">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.id}
                      className={cn(
                        column.align === "right" && "text-right",
                        column.className
                      )}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={getRowKey(row)}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={cn(
                          column.align === "right" && "text-right",
                          column.className
                        )}
                      >
                        {column.render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="grid gap-3 md:hidden">
            {rows.map((row) => (
              <article
                key={getRowKey(row)}
                className="min-w-0 rounded-xl border border-border/70 bg-card p-4 shadow-sm"
              >
                {columns.map((column, index) => (
                  <div
                    key={column.id}
                    className={cn(
                      "flex min-w-0 items-start justify-between gap-4 py-2",
                      index === 0 && "border-b pb-3",
                      index === columns.length - 1 && "pt-3"
                    )}
                  >
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {column.label}
                    </span>
                    <div className="min-w-0 text-right text-sm">
                      {column.render(row)}
                    </div>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </>
      )}
      {totalPages > 1 ? (
        <nav
          aria-label="Pagination"
          className="mt-5 flex flex-wrap items-center justify-between gap-3"
        >
          <span className="text-xs text-muted-foreground">
            Showing {firstItem}–{lastItem}
          </span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                })}
                href={makeHref(page - 1)}
              >
                Previous
              </Link>
            ) : null}
            {page < totalPages ? (
              <Link
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                })}
                href={makeHref(page + 1)}
              >
                Next
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </section>
  );
}
