import { apiClient } from "@/lib/api/client";
import type { Appointment } from "../types";

export async function getAppointments(): Promise<Appointment[]> {
  const { data } = await apiClient.get<Appointment[]>("/appointments");
  return data;
}
