import { EncounterDetailView } from "@/features/encounters";

export default async function EncounterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EncounterDetailView id={id} />;
}
