import { apiClient } from "@/lib/api/client";
import { mapPatientDetailResponse, mapPatientResponse } from "../mappers";
import type { Patient, PatientDetail } from "../types";
import type {
  ApiPatient,
  ApiPatientDetail,
  CreatePatientPayload,
  UpdatePatientPayload,
} from "./backend-types";

export async function getPatients(): Promise<Patient[]> {
  const { data } = await apiClient.get<(ApiPatient | Patient)[]>("/patients");
  return data.map(mapPatientResponse);
}

export async function getPatient(id: string): Promise<PatientDetail> {
  const { data } = await apiClient.get<ApiPatientDetail | PatientDetail>(
    `/patients/${id}`,
  );
  return mapPatientDetailResponse(data);
}

export async function createPatient(
  payload: CreatePatientPayload,
): Promise<Patient> {
  const { data } = await apiClient.post<ApiPatient>("/patients", payload);
  return mapPatientResponse(data);
}

export async function updatePatient(
  id: string,
  payload: UpdatePatientPayload,
): Promise<Patient> {
  const { data } = await apiClient.patch<ApiPatient>(`/patients/${id}`, payload);
  return mapPatientResponse(data);
}

export async function deletePatient(id: string): Promise<void> {
  await apiClient.delete(`/patients/${id}`);
}
