"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { IpdBoard } from "@/features/ipd/IpdBoard";

export default function IpdPage() {
  return (
    <>
      <PageHeader title="IPD / Admissions" subtitle="Wards, beds & inpatients" />
      <IpdBoard />
    </>
  );
}
