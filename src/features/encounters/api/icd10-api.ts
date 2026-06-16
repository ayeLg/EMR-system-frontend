import { apiClient } from "@/lib/api/client";

export interface Icd10Code {
  code: string;
  description: string;
  category?: string | null;
}

export async function searchIcd10(q?: string): Promise<Icd10Code[]> {
  const { data } = await apiClient.get<Icd10Code[]>("/master-data/icd10", {
    params: q ? { q } : undefined,
  });
  return data;
}
