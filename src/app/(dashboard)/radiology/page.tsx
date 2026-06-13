"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { RadiologyQueue } from "@/features/radiology";

export default function RadiologyPage() {
  const t = useTranslations();
  return (
    <>
      <PageHeader title={t("nav.radiology")} subtitle="Radiology order queue" />
      <RadiologyQueue />
    </>
  );
}
