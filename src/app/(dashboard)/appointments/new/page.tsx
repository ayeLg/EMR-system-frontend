"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { BookingForm } from "@/features/appointments";

export default function NewAppointmentPage() {
  return (
    <>
      <PageHeader title="Book appointment" subtitle="New appointment" />
      <BookingForm />
    </>
  );
}
