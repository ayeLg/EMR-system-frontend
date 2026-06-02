"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { CreateButton } from "@/components/ui/CreateButton";
import { Can } from "@/lib/rbac/Can";
import { AppointmentTable } from "@/features/appointments";
import { ROUTES } from "@/config/routes";

export default function AppointmentsPage() {
  const t = useTranslations();

  return (
    <>
      <PageHeader
        title={t("nav.appointments")}
        subtitle={t("appointments.subtitle")}
        actions={
          <Can permission="appointment:read">
            <CreateButton href={`${ROUTES.appointments}/new`}>
              {t("common.book")}
            </CreateButton>
          </Can>
        }
      />
      <AppointmentTable />
    </>
  );
}
