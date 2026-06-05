import { apiClient } from "@/lib/api/client";
import { mapPatientDetailResponse, mapPatientResponse } from "../mappers";
import type { Patient, PatientDetail } from "../types";
import type { ApiPatient } from "./backend-types";

export async function getPatients(): Promise<Patient[]> {
  const { data } = await apiClient.get<(ApiPatient | Patient)[]>("/patients");
  return data.map(mapPatientResponse);
}

export async function getPatient(id: string): Promise<PatientDetail> {
  const { data } = await apiClient.get<ApiPatient | PatientDetail>(`/patients/${id}`);
  return mapPatientDetailResponse(data);
}
