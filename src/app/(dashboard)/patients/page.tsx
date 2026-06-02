"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { CreateButton } from "@/components/ui/CreateButton";
import { Can } from "@/lib/rbac/Can";
import { PatientTable } from "@/features/patients";
import { ROUTES } from "@/config/routes";

export default function PatientsPage() {
  const t = useTranslations();

  return (
    <>
      <PageHeader
        title={t("patients.title")}
        subtitle={t("patients.subtitle")}
        actions={
          <Can permission="patient:create">
            <CreateButton href={`${ROUTES.patients}/new`}>
              {t("common.register")}
            </CreateButton>
          </Can>
        }
      />
      <PatientTable />
    </>
  );
}
