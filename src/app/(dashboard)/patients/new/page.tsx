"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { RegistrationForm } from "@/features/patients/components/RegistrationForm";

export default function PatientRegistrationPage() {
  const t = useTranslations();

  return (
    <>
      <PageHeader
        title={t("common.register")}
        subtitle="New patient registration"
      />
      <RegistrationForm />
    </>
  );
}
