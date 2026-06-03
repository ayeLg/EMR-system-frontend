"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { PrintPreviews } from "@/features/printing/PrintPreviews";

export default function PrintPreviewsPage() {
  return (
    <>
      <PageHeader title="Print previews" subtitle="Prescription · receipt · lab report · MRN card" />
      <PrintPreviews />
    </>
  );
}
