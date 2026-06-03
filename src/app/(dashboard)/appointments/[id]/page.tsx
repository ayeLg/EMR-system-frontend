import { AppointmentDetailView } from "@/features/appointments/components/AppointmentDetailView";

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AppointmentDetailView id={id} />;
}
