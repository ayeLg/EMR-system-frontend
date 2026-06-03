"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { NurseQueue } from "@/features/nurse-queue/NurseQueue";

export default function NurseQueuePage() {
  return (
    <>
      <PageHeader title="Nurse queue" subtitle="Pre-assessment — arrived patients" />
      <NurseQueue />
    </>
  );
}
