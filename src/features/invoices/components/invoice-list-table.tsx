"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { defaultNotes } from "@/data/invoice-static";
import { deleteInvoiceAction } from "@/features/invoices/actions/delete-invoice";
import { exportInvoicePdfAction } from "@/features/invoices/actions/export-invoice-pdf";
import type { InvoiceListItem } from "@/features/invoices/actions/list-invoices";
import { InvoicePreview } from "@/features/invoices/components/invoice-preview";
import type { CreateInvoiceInput } from "@/features/invoices/schemas/invoice.schema";
import { downloadPdfFromBase64 } from "@/features/invoices/utils/download-pdf";
import { formatInvoiceMoney } from "@/features/invoices/utils/format-invoice-money";
import { Download, Eye, LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface InvoiceListTableProps {
  items: InvoiceListItem[];
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

const SUPPORTED_CURRENCIES: ReadonlyArray<CreateInvoiceInput["currency"]> = [
  "USD",
  "EUR",
  "GBP",
  "BDT",
];

export function InvoiceListTable({ items }: InvoiceListTableProps) {
  const router = useRouter();
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceListItem | null>(
    null,
  );
  const [deleteInvoice, setDeleteInvoice] = useState<InvoiceListItem | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [exportingInvoiceId, setExportingInvoiceId] = useState<string | null>(
    null,
  );

  const handleDelete = async (): Promise<void> => {
    if (!deleteInvoice) return;
    setIsDeleting(true);
    const result = await deleteInvoiceAction(deleteInvoice.id);
    setIsDeleting(false);
    if (!result.ok) {
      toast.error("Couldn’t delete invoice", { description: result.message });
      return;
    }
    toast.success("Invoice deleted");
    setDeleteInvoice(null);
    router.refresh();
  };

  const handleExport = async (invoice: InvoiceListItem): Promise<void> => {
    setExportingInvoiceId(invoice.id);
    const currency =
      SUPPORTED_CURRENCIES.find((value) => value === invoice.currency) ?? "USD";
    const exportInput: CreateInvoiceInput = {
      customerId: invoice.customerId,
      piNumber: invoice.preview.piNumber,
      issueDate: invoice.issueDate,
      currency,
      buyer: invoice.preview.buyer,
      lineItems: invoice.preview.lineItems.map((item) => ({
        fabric: item.fabric,
        construction: item.construction,
        width: item.width,
        style: item.style,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalAmount,
      })),
      notes: { ...defaultNotes, ...invoice.preview.notes },
      termsAndConditions: invoice.preview.termsAndConditions,
    };

    try {
      const result = await exportInvoicePdfAction(exportInput, invoice.id);
      if (!result.ok) {
        toast.error("Couldn’t export invoice", { description: result.message });
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

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>PI number</TableHead>
              <TableHead>Buyer / Consignee</TableHead>
              <TableHead>Issue date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total quantity</TableHead>
              <TableHead className="text-right">Unit price total</TableHead>
              <TableHead className="text-right">Total amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-semibold">
                  {invoice.invoiceNumber}
                </TableCell>
                <TableCell className="max-w-56 truncate">
                  {invoice.buyerName}
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(invoice.issueDate))}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[invoice.status]}>
                    {STATUS_LABELS[invoice.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {new Intl.NumberFormat("en-US").format(invoice.totalQuantity)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatInvoiceMoney(invoice.totalUnitPrice, invoice.currency)}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatInvoiceMoney(invoice.totalAmount, invoice.currency)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
