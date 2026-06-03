"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { DoctorSchedules } from "@/features/schedules/DoctorSchedules";

export default function DoctorSchedulesPage() {
  return (
    <>
      <PageHeader title="Doctor schedules" subtitle="Availability & slot configuration" />
      <DoctorSchedules />
    </>
  );
}
