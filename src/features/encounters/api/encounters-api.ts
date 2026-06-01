import { apiClient } from "@/lib/api/client";
import type { Encounter, EncounterDetail } from "../types";

export async function getEncounters(): Promise<Encounter[]> {
  const { data } = await apiClient.get<Encounter[]>("/encounters");
  return data;
}

export async function getEncounter(id: string): Promise<EncounterDetail> {
  const { data } = await apiClient.get<EncounterDetail>(`/encounters/${id}`);
  return data;
}
