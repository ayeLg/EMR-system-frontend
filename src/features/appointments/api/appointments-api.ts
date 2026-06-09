import { apiClient } from "@/lib/api/client";
import type { Appointment, AppointmentStatus, AppointmentType } from "../types";

export interface CreateAppointmentPayload {
  patientId: string;
  doctorId: string;
  departmentId: string;
  scheduledAt: string;
  durationMinutes?: number;
  type: AppointmentType;
  chiefComplaint?: string;
  notes?: string;
}

export type UpdateAppointmentPayload = Partial<CreateAppointmentPayload> & {
  status?: AppointmentStatus;
  cancelledReason?: string;
};

export async function getAppointments(): Promise<Appointment[]> {
  const { data } = await apiClient.get<Appointment[]>("/appointments");
  return data;
}

export async function getAppointment(id: string): Promise<Appointment> {
  const { data } = await apiClient.get<Appointment>(`/appointments/${id}`);
  return data;
}

export async function createAppointment(
  payload: CreateAppointmentPayload,
): Promise<Appointment> {
  const { data } = await apiClient.post<Appointment>("/appointments", payload);
  return data;
}

export async function updateAppointment(
  id: string,
  payload: UpdateAppointmentPayload,
): Promise<Appointment> {
  const { data } = await apiClient.patch<Appointment>(
    `/appointments/${id}`,
    payload,
  );
  return data;
}

export async function deleteAppointment(id: string): Promise<void> {
  await apiClient.delete(`/appointments/${id}`);
}
