"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { LabOrderQueue } from "@/features/laboratory";

export default function LaboratoryPage() {
  const t = useTranslations();
  return (
    <>
      <PageHeader title={t("nav.laboratory")} subtitle="Lab order queue" />
      <LabOrderQueue />
    </>
  );
}
