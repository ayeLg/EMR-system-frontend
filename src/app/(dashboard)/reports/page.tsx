"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { Dashboard } from "@/features/reports";

export default function ReportsPage() {
  const t = useTranslations();
  return (
    <>
      <PageHeader title={t("nav.reports")} subtitle="Analytics & insights" />
      <Dashboard />
    </>
  );
}
