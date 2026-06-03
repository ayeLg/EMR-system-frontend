import { PatientEditView } from "@/features/patients/components/PatientEditView";

export default async function PatientEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PatientEditView id={id} />;
}
