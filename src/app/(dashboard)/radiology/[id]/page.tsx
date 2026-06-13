import { RadiologyDetailView } from "@/features/radiology";

export default async function RadiologyDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  return <RadiologyDetailView id={id} />;
}
