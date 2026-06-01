"use client";

import { Tabs } from "antd";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrescriptionQueue, InventoryTable } from "@/features/pharmacy";

export default function PharmacyPage() {
  const t = useTranslations();
  return (
    <>
      <PageHeader title={t("nav.pharmacy")} subtitle="Dispensing & inventory" />
      <Tabs
        items={[
          { key: "queue", label: "Prescription queue", children: <PrescriptionQueue /> },
          { key: "inventory", label: "Inventory", children: <InventoryTable /> },
        ]}
      />
    </>
  );
}
