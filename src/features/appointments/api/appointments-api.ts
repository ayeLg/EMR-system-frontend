import { apiClient } from "@/lib/api/client";
import type { Appointment } from "../types";

export async function getAppointments(): Promise<Appointment[]> {
  const { data } = await apiClient.get<Appointment[]>("/appointments");
  return data;
}

export async function getAppointment(id: string): Promise<Appointment> {
  const { data } = await apiClient.get<Appointment>(`/appointments/${id}`);
  return data;
}
