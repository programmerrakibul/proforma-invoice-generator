"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface ListToolbarOption {
  value: string;
  label: string;
}

export interface ListToolbarControl {
  name: string;
  label: string;
  value: string;
  options: ListToolbarOption[];
}

interface ListToolbarProps {
  action: string;
  search: string;
  searchPlaceholder: string;
  controls: ListToolbarControl[];
}

export function ListToolbar({
  action,
  search: initialSearch,
  searchPlaceholder,
  controls,
}: ListToolbarProps) {
  const [search, setSearch] = useState(initialSearch);
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <form
      ref={formRef}
      method="GET"
      action={action}
      onSubmit={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
      }}
      className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[minmax(16rem,1fr)_repeat(2,minmax(9rem,12rem))_auto]"
    >
      <label className="relative flex min-w-0 items-center sm:col-span-2 lg:col-span-1">
        <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
        <Input
          name="search"
          aria-label={searchPlaceholder}
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(
              () => formRef.current?.requestSubmit(),
              350,
            );
          }}
          placeholder={searchPlaceholder}
          className="h-10 rounded-xl pl-9"
        />
      </label>
      {controls.map((control) => (
        <select
          key={control.name}
          id={control.name}
          name={control.name}
          defaultValue={control.value}
          aria-label={control.label}
          className="h-10 min-w-0 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          {control.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      <Button type="submit" variant="secondary" className="h-10 rounded-xl">
        Apply
      </Button>
    </form>
  );
}
