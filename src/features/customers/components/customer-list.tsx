"use client";

import { ListToolbar } from "@/components/shared/list-toolbar";
import {
  ResponsiveDataTable,
  type DataTableColumn,
} from "@/components/shared/responsive-data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomerForm } from "@/features/customers/components/customer-form";
import type {
  CustomerListItem,
  CustomerPageResult,
} from "@/features/customers/actions/customer-actions";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";

interface CustomerListProps {
  customers: CustomerPageResult;
  query: {
    search: string;
    filter: "all" | "email" | "phone";
    sort: "name" | "oldest" | "newest";
  };
}

export function CustomerList({ customers, query }: CustomerListProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerListItem | null>(null);

  const openCreateDialog = (): void => {
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  const openEditDialog = (customer: CustomerListItem): void => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

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
      id: "email",
      label: "Email",
      render: (customer) => (
        <span className="block whitespace-normal">
          {customer.email || "N/A"}
        </span>
      ),
    },
    {
      id: "phone",
      label: "Phone",
      render: (customer) => (
        <span className="block whitespace-normal">
          {customer.phone || "N/A"}
        </span>
      ),
    },
    {
      id: "createdAt",
      label: "Created at",
      render: (customer) =>
        new Intl.DateTimeFormat("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(customer.createdAt)),
    },
    {
      id: "actions",
      label: "Actions",
      align: "right",
      render: (customer) => (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit ${customer.name}`}
            onClick={() => openEditDialog(customer)}
          >
            <Pencil />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
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
        <Button
          type="button"
          onClick={openCreateDialog}
          className="w-full sm:w-auto"
        >
          <Plus data-icon="inline-start" />
          Add customer
        </Button>
      </header>
      <ListToolbar
        key={`${query.search}:${query.filter}:${query.sort}`}
        action="/dashboard/customers"
        search={query.search}
        searchPlaceholder="Search customers"
        controls={[
          {
            name: "sort",
            label: "Sort customers",
            value: query.sort,
            options: [
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
              { value: "name", label: "Name" },
            ],
          },
        ]}
      />
      <ResponsiveDataTable
        columns={columns}
        rows={customers.items}
        getRowKey={(customer) => customer.id}
        emptyMessage={
          query.search || query.filter !== "all"
            ? "No matching customers."
            : "Add a customer to use it on invoices."
        }
        page={customers.page}
        pageSize={customers.pageSize}
        total={customers.total}
        basePath="/dashboard/customers"
        query={query}
      />
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedCustomer(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer ? "Edit customer" : "Add customer"}
            </DialogTitle>
            <DialogDescription>
              {selectedCustomer
                ? "Update this customer’s details."
                : "Enter the customer details to make them available for invoices."}
            </DialogDescription>
          </DialogHeader>
          {dialogOpen ? (
            <CustomerForm
              key={selectedCustomer?.id ?? "new-customer"}
              customer={selectedCustomer ?? undefined}
              onSaved={() => {
                setDialogOpen(false);
                setSelectedCustomer(null);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
