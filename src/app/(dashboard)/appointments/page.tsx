"use client";

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { Can } from "@/lib/rbac/Can";
import { AppointmentTable } from "@/features/appointments";
import { ROUTES } from "@/config/routes";

export default function AppointmentsPage() {
  const t = useTranslations();

  return (
    <>
      <PageHeader
        title={t("nav.appointments")}
        subtitle="Scheduling & queue"
        actions={
          <Can permission="appointment:read">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              href={`${ROUTES.appointments}/new`}
            >
              Book
            </Button>
          </Can>
        }
      />
      <AppointmentTable />
    </>
  );
}
