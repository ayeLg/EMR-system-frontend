import { apiClient } from "@/lib/api/client";
import type {
  Diagnosis,
  Encounter,
  EncounterDetail,
  EncounterStatus,
} from "../types";
import type { SoapValues, VitalsValues } from "../schemas";

export async function getEncounters(): Promise<Encounter[]> {
  const { data } = await apiClient.get<Encounter[]>("/encounters");
  return data;
}

export async function getEncounter(id: string): Promise<EncounterDetail> {
  const { data } = await apiClient.get<EncounterDetail>(`/encounters/${id}`);
  return data;
}

export async function saveSoapNote(
  encounterId: string,
  values: SoapValues,
): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>(
    `/encounters/${encounterId}/notes`,
    values,
  );
  return data;
}

export async function recordEncounterVitals(
  encounterId: string,
  values: VitalsValues,
): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>(
    `/encounters/${encounterId}/vitals`,
    values,
  );
  return data;
}

export async function addEncounterDiagnosis(
  encounterId: string,
  diagnosis: Diagnosis,
): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>(
    `/encounters/${encounterId}/diagnoses`,
    diagnosis,
  );
  return data;
}

export async function updateEncounterStatus(
  encounterId: string,
  status: Extract<EncounterStatus, "COMPLETED" | "CANCELLED">,
): Promise<Encounter> {
  const { data } = await apiClient.patch<Encounter>(
    `/encounters/${encounterId}/status`,
    { status },
  );
  return data;
}
