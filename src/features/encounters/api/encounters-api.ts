import { apiClient } from "@/lib/api/client";
import type {
  Diagnosis,
  Encounter,
  EncounterDetail,
  EncounterStatus,
} from "../types";
import type { SoapValues, VitalsValues } from "../schemas";

export interface CreatePrescriptionPayload {
  medicationId: string;
  dose: string;
  route: string;
  frequency: string;
  quantityPrescribed: number;
  durationDays?: number;
  instructions?: string;
  overrideReason?: string;
  notes?: string;
}

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

export async function createPrescription(
  encounterId: string,
  payload: CreatePrescriptionPayload,
): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>(
    `/encounters/${encounterId}/prescriptions`,
    payload,
  );
  return data;
}

export interface CreateLabOrderPayload {
  labTestIds: string[];
  priority?: "STAT" | "URGENT" | "ROUTINE";
  clinicalNotes?: string;
}

export interface CreateMedicalOrderPayload {
  orderType: "RADIOLOGY" | "DIET" | "NURSING" | "REFERRAL";
  priority?: "STAT" | "URGENT" | "ROUTINE";
  description: string;
  notes?: string;
}

export interface LabTestSummary {
  id: string;
  code: string;
  name: string;
  category: string;
  sampleType: string;
  price: number;
}

export async function createLabOrder(
  encounterId: string,
  payload: CreateLabOrderPayload,
): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>(
    `/encounters/${encounterId}/lab-orders`,
    payload,
  );
  return data;
}

export async function createMedicalOrder(
  encounterId: string,
  payload: CreateMedicalOrderPayload,
): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>(
    `/encounters/${encounterId}/orders`,
    payload,
  );
  return data;
}

export async function getLabTests(): Promise<LabTestSummary[]> {
  const { data } = await apiClient.get<LabTestSummary[]>("/master-data/lab-tests");
  return data;
}

