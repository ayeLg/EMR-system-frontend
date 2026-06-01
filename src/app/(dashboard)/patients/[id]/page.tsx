import { PatientDetailView } from "@/features/patients/components/PatientDetailView";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PatientDetailView id={id} />;
}
