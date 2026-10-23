"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface InvoiceListFiltersProps {
  search: string;
  status: "all" | "draft" | "exported";
  sort: "newest" | "oldest" | "highest" | "lowest";
}

export function InvoiceListFilters({
  search: initialSearch,
  status,
  sort,
}: InvoiceListFiltersProps) {
  const [search, setSearch] = useState(initialSearch);
  const formRef = useRef<HTMLFormElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (debounceTimer.current !== null) {
        clearTimeout(debounceTimer.current);
      }
    },
    [],
  );

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearch(event.currentTarget.value);

    if (debounceTimer.current !== null) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 350);
  };

  return (
    <form
      ref={formRef}
      method="GET"
      action="/invoices"
      className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm md:grid-cols-[minmax(16rem,1fr)_12rem_12rem_auto]"
    >
      <label className="relative flex items-center">
        <Search className="absolute left-3 size-4 text-muted-foreground" />
        <input
          name="search"
          value={search}
          onChange={handleSearchChange}
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
        <option value="exported">Exported</option>
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
      <Button type="submit" variant="secondary" className="h-10 rounded-xl px-5">
        Apply
      </Button>
    </form>
  );
}
