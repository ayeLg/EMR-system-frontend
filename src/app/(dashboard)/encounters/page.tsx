"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { EncounterTable } from "@/features/encounters";

export default function EncountersPage() {
  const t = useTranslations();
  return (
    <>
      <PageHeader title={t("nav.encounters")} subtitle="Clinical encounters" />
      <EncounterTable />
    </>
  );
}
