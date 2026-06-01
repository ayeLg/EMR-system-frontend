"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { UsersTable } from "@/features/users";

export default function UsersPage() {
  const t = useTranslations();
  return (
    <>
      <PageHeader title={t("nav.users")} subtitle="Staff & access management" />
      <UsersTable />
    </>
  );
}
