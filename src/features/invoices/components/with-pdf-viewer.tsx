"use client";

import dynamic from "next/dynamic";
import type { ComponentType, ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false },
);

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false },
);

interface PdfDocumentPropsBase {
  fileName?: string;
}

interface WithPdfViewerOptions {
  fileName: string;
  viewerClassName?: string;
  showToolbar?: boolean;
}

type PdfPreviewProps = Record<string, unknown> & {
  fileName?: string;
  viewerClassName?: string;
};

export interface PdfPreviewToolbarProps {
  document: ReactElement;
  fileName: string;
}

function PdfPreviewToolbar({ document, fileName }: PdfPreviewToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2">
      <div className="text-xs font-medium text-muted-foreground">PDF Preview</div>
      <PDFDownloadLink
        document={document as any}
        fileName={fileName}
      >
        {({ loading, error }: { loading: boolean; error?: Error | null }) => {
          if (error) {
            console.error("PDF export error:", error);
          }
          return (
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <DownloadIcon className="mr-2 size-3.5 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <DownloadIcon className="mr-2 size-3.5" />
                  Export PDF
                </>
              )}
            </Button>
          );
        }}
      </PDFDownloadLink>
    </div>
  );
}

export function withPdfViewer<P extends object>(
  DocumentComponent: ComponentType<P>,
  options: WithPdfViewerOptions,
): ComponentType<P & PdfPreviewProps> {
  function WithPdfViewerComponent(props: P & PdfPreviewProps) {
    const fileName = props.fileName ?? options.fileName;
    const viewerClassName = props.viewerClassName ?? options.viewerClassName;

    const document = <DocumentComponent {...(props as P)} />;

    return (
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border">
        <PdfPreviewToolbar document={document} fileName={fileName} />
        <div className="flex-1 overflow-hidden bg-muted/20">
          <PDFViewer
            className={viewerClassName ?? "h-full w-full border-0"}
            showToolbar={options.showToolbar ?? true}
          >
            {document}
          </PDFViewer>
        </div>
      </div>
    );
  }

  WithPdfViewerComponent.displayName = `WithPdfViewer(${DocumentComponent.displayName ?? DocumentComponent.name ?? "Component"})`;

  return WithPdfViewerComponent;
}