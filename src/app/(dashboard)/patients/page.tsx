"use client";

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              href={`${ROUTES.patients}/new`}
            >
              {t("common.register")}
            </Button>
          </Can>
        }
      />
      <PatientTable />
    </>
  );
}
