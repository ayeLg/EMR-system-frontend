import { apiClient } from "@/lib/api/client";
import type { DoctorSchedule, DoctorSchedulePayload } from "../types";

const base = "/doctor-schedules";

export async function listDoctorSchedules(params?: {
  doctorId?: string;
  dayOfWeek?: number;
}): Promise<DoctorSchedule[]> {
  const { data } = await apiClient.get<DoctorSchedule[]>(base, { params });
  return data;
}

export async function createDoctorSchedule(
  payload: DoctorSchedulePayload,
): Promise<DoctorSchedule> {
  const { data } = await apiClient.post<DoctorSchedule>(base, payload);
  return data;
}

export async function updateDoctorSchedule(
  id: string,
  payload: Partial<DoctorSchedulePayload>,
): Promise<DoctorSchedule> {
  const { data } = await apiClient.patch<DoctorSchedule>(`${base}/${id}`, payload);
  return data;
}

export async function setDoctorScheduleActive(
  id: string,
  isActive: boolean,
): Promise<DoctorSchedule> {
  const { data } = await apiClient.patch<DoctorSchedule>(`${base}/${id}/is-active`, {
    isActive,
  });
  return data;
}

export async function deleteDoctorSchedule(id: string): Promise<void> {
  await apiClient.delete(`${base}/${id}`);
}
