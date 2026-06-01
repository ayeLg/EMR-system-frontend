import { apiClient } from "@/lib/api/client";
import type { Patient, PatientDetail } from "../types";

export async function getPatients(): Promise<Patient[]> {
  const { data } = await apiClient.get<Patient[]>("/patients");
  return data;
}

export async function getPatient(id: string): Promise<PatientDetail> {
  const { data } = await apiClient.get<PatientDetail>(`/patients/${id}`);
  return data;
}
