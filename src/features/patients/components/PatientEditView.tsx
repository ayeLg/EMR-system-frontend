"use client";

import dayjs from "dayjs";
import { Skeleton } from "antd";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { usePatient } from "../hooks/usePatient";
import { RegistrationForm } from "./RegistrationForm";
import type { RegistrationValues } from "../schemas";

export function PatientEditView({ id }: { id: string }) {
  const { data, isLoading } = usePatient(id);

  if (isLoading) return <Skeleton active paragraph={{ rows: 8 }} />;
  if (!data) return <EmptyState description="Patient not found" />;

  const [firstName, ...rest] = data.fullName.split(" ");
  const defaults: Partial<RegistrationValues> = {
    firstName,
    lastName: rest.join(" "),
    dateOfBirth: dayjs(data.dateOfBirth),
    gender: data.gender,
    nrcNumber: data.nrcNumber ?? "",
    bloodType: data.bloodType as RegistrationValues["bloodType"],
    primaryPhone: data.primaryPhone,
    email: data.email ?? "",
    address: data.address ?? "",
    city: data.city ?? "",
    township: data.township ?? "",
  };

  return (
    <>
      <PageHeader title="Edit patient" subtitle={`${data.fullName} · ${data.mrn}`} />
      <RegistrationForm mode="edit" patientId={id} defaultValues={defaults} />
    </>
  );
}
