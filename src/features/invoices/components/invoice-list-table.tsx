"use client";

import {
  ResponsiveDataTable,
  type DataTableColumn,
} from "@/components/shared/responsive-data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteInvoiceAction } from "@/features/invoices/actions/delete-invoice";
import { exportSavedInvoicePdfAction } from "@/features/invoices/actions/export-invoice-pdf";
import type { InvoiceListItem } from "@/features/invoices/actions/list-invoices";
import { InvoicePreview } from "@/features/invoices/components/invoice-preview";
import { downloadPdfFromBase64 } from "@/features/invoices/utils/download-pdf";
import { formatInvoiceMoney } from "@/features/invoices/utils/format-invoice-money";
import { Download, Eye, LoaderCircle, PencilIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface InvoiceListTableProps {
  items: InvoiceListItem[];
  page: number;
  pageSize: number;
  total: number;
  query: Record<string, string | undefined>;
}

const STATUS_LABELS: Record<InvoiceListItem["status"], string> = {
  draft: "Draft",
  exported: "Exported",
};

const STATUS_VARIANTS: Record<
  InvoiceListItem["status"],
  "default" | "secondary" | "outline" | "ghost"
> = {
  draft: "outline",
  exported: "secondary",
};

export function InvoiceListTable({
  items,
  page,
  pageSize,
  total,
  query,
}: InvoiceListTableProps) {
  const router = useRouter();
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceListItem | null>(
    null
  );
  const [deleteInvoice, setDeleteInvoice] = useState<InvoiceListItem | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [exportingInvoiceId, setExportingInvoiceId] = useState<string | null>(
    null
  );

  const handleDelete = async (): Promise<void> => {
    if (!deleteInvoice) return;
    setIsDeleting(true);
    const result = await deleteInvoiceAction(deleteInvoice.id);
    setIsDeleting(false);
    if (!result.ok) {
      toast.error("Couldn’t delete invoice", {
        description: result.message,
      });
      return;
    }
    toast.success("Invoice deleted");
    setDeleteInvoice(null);
    router.refresh();
  };

  const handleExport = async (invoice: InvoiceListItem): Promise<void> => {
    setExportingInvoiceId(invoice.id);

    try {
      const result = await exportSavedInvoicePdfAction(invoice.id);
      if (!result.ok) {
        toast.error("Couldn’t export invoice", {
          description: result.message,
        });
        return;
      }

      downloadPdfFromBase64(result.data.pdfBase64, result.data.fileName);
      toast.success("Invoice exported", {
        description: "Your PDF has been downloaded.",
      });
      router.refresh();
    } catch {
      toast.error("Couldn’t export invoice", {
        description: "Please try again.",
      });
    } finally {
      setExportingInvoiceId(null);
    }
  };

  const columns: DataTableColumn<InvoiceListItem>[] = [
    {
      id: "invoiceNumber",
      label: "PI number",
      render: (invoice) => (
        <span className="font-semibold">{invoice.invoiceNumber}</span>
      ),
    },
    {
      id: "buyer",
      label: "Buyer / Consignee",
      render: (invoice) => (
        <span className="block max-w-56 truncate">{invoice.buyerName}</span>
      ),
    },
    {
      id: "issueDate",
      label: "Issue date",
      render: (invoice) =>
        new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(invoice.issueDate)),
    },
    {
      id: "status",
      label: "Status",
      render: (invoice) => (
        <Badge variant={STATUS_VARIANTS[invoice.status]}>
          {STATUS_LABELS[invoice.status]}
        </Badge>
      ),
    },
    {
      id: "quantity",
      label: "Total quantity",
      align: "right",
      render: (invoice) =>
        new Intl.NumberFormat("en-US").format(invoice.totalQuantity),
    },
    {
      id: "unitPrice",
      label: "Unit price total",
      align: "right",
      render: (invoice) =>
        formatInvoiceMoney(invoice.totalUnitPrice, invoice.currency),
    },
    {
      id: "amount",
      label: "Total amount",
      align: "right",
      render: (invoice) => (
        <span className="font-semibold">
          {formatInvoiceMoney(invoice.totalAmount, invoice.currency)}
        </span>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      align: "right",
      render: (invoice) => (
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Update ${invoice.invoiceNumber}`}
            render={<Link href={`/dashboard/invoices/edit/${invoice.id}`} />}
            nativeButton={false}
          >
            <PencilIcon />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Preview ${invoice.invoiceNumber}`}
            onClick={() => setPreviewInvoice(invoice)}
          >
            <Eye />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Export ${invoice.invoiceNumber} as PDF`}
            title="Export PDF"
            disabled={exportingInvoiceId === invoice.id}
            onClick={() => void handleExport(invoice)}
          >
            {exportingInvoiceId === invoice.id ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Download />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${invoice.invoiceNumber}`}
            onClick={() => setDeleteInvoice(invoice)}
          >
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ResponsiveDataTable
        columns={columns}
        rows={items}
        getRowKey={(invoice) => invoice.id}
        emptyMessage="No invoices found."
        page={page}
        pageSize={pageSize}
        total={total}
        basePath="/dashboard/invoices"
        query={query}
      />

      <Dialog
        open={previewInvoice !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewInvoice(null);
        }}
      >
        <DialogContent className="max-h-[94vh] max-w-[96vw] overflow-hidden p-5 sm:max-w-[96vw]">
          <DialogHeader>
            <DialogTitle>Invoice preview</DialogTitle>
            <DialogDescription>
              {previewInvoice?.invoiceNumber} · {previewInvoice?.buyerName}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(94vh-6rem)] overflow-auto rounded-lg bg-muted/40 p-3">
            {previewInvoice ? (
              <InvoicePreview data={previewInvoice.preview} />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteInvoice !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleteInvoice(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteInvoice?.invoiceNumber} will be permanently removed from
              your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete invoice"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
