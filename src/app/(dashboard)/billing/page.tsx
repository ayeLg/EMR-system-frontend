"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { InvoiceTable } from "@/features/billing";

export default function BillingPage() {
  const t = useTranslations();
  return (
    <>
      <PageHeader title={t("nav.billing")} subtitle="Invoices & payments" />
      <InvoiceTable />
    </>
  );
}
