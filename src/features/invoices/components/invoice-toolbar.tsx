"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, Save, Eye } from "lucide-react";

export interface InvoiceToolbarProps {
  isSaving: boolean;
  isDirty: boolean;
  isPreviewOpen: boolean;
  onSave: () => void;
  onExport: () => void;
  onTogglePreview: () => void;
}

export function InvoiceToolbar({
  isSaving,
  isDirty,
  isPreviewOpen,
  onSave,
  onExport,
  onTogglePreview,
}: InvoiceToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border bg-background px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={isSaving || !isDirty}
        >
          <Save className="size-3.5 mr-2" />
          {isSaving ? "Saving…" : "Save draft"}
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="size-3.5 mr-2" />
          Export PDF
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          {isDirty ? "Unsaved changes" : "All changes saved"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label={isPreviewOpen ? "Close preview" : "Open preview"}
          onClick={onTogglePreview}
          className="relative"
        >
          <Eye className="size-4" />
          {isPreviewOpen && (
            <span className="absolute top-0 right-0 size-2 bg-primary rounded-full border border-background" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="More actions"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}
