import { apiClient } from "@/lib/api/client";
import type { RadiologyOrder } from "../types";

export async function getRadiologyOrders(): Promise<RadiologyOrder[]> {
  const { data } = await apiClient.get<RadiologyOrder[]>("/radiology/orders");
  return data;
}

export async function getRadiologyOrder(id: string): Promise<RadiologyOrder> {
  const { data } = await apiClient.get<RadiologyOrder>(`/radiology/orders/${id}`);
  return data;
}

export async function startRadiologyScan(id: string): Promise<RadiologyOrder> {
  const { data } = await apiClient.post<RadiologyOrder>(`/radiology/orders/${id}/start`);
  return data;
}

export interface SubmitRadiologyResultsPayload {
  findings: string;
  impression: string;
  imagingUrl?: string;
}

export async function submitRadiologyResults(
  id: string,
  payload: SubmitRadiologyResultsPayload,
): Promise<RadiologyOrder> {
  const { data } = await apiClient.post<RadiologyOrder>(
    `/radiology/orders/${id}/results`,
    payload,
  );
  return data;
}

export async function cancelRadiologyOrder(id: string): Promise<RadiologyOrder> {
  const { data } = await apiClient.post<RadiologyOrder>(`/radiology/orders/${id}/cancel`);
  return data;
}
