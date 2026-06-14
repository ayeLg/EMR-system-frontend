import { apiClient } from "@/lib/api/client";
import type {
  Inpatient,
  WardOccupancy,
  AdmitPatientPayload,
  DischargePatientPayload,
  CreateProgressNotePayload,
} from "../types";

export async function getWardOccupancy(): Promise<WardOccupancy[]> {
  const { data } = await apiClient.get<WardOccupancy[]>("/ipd/wards");
  return data;
}

export async function getInpatients(): Promise<Inpatient[]> {
  const { data } = await apiClient.get<Inpatient[]>("/ipd/inpatients");
  return data;
}

export async function admitPatient(
  payload: AdmitPatientPayload,
): Promise<Inpatient> {
  const { data } = await apiClient.post<Inpatient>("/ipd/admissions", payload);
  return data;
}

export async function dischargePatient(
  id: string,
  payload: DischargePatientPayload,
): Promise<{ success: boolean }> {
  const { data } = await apiClient.post<{ success: boolean }>(
    `/ipd/admissions/${id}/discharge`,
    payload,
  );
  return data;
}

export async function createProgressNote(
  id: string,
  payload: CreateProgressNotePayload,
): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>(
    `/ipd/admissions/${id}/notes`,
    payload,
  );
  return data;
}
