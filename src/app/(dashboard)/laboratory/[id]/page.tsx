import { LabOrderDetailView } from "@/features/laboratory";

export default async function LabOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LabOrderDetailView id={id} />;
}
