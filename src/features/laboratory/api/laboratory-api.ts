import { apiClient } from "@/lib/api/client";
import type { LabOrder, LabOrderDetail } from "../types";

export async function getLabOrders(): Promise<LabOrder[]> {
  const { data } = await apiClient.get<LabOrder[]>("/lab/orders");
  return data;
}

export async function getLabOrder(id: string): Promise<LabOrderDetail> {
  const { data } = await apiClient.get<LabOrderDetail>(`/lab/orders/${id}`);
  return data;
}

export async function collectSpecimen(
  id: string,
  specimenBarcode?: string,
): Promise<LabOrderDetail> {
  const { data } = await apiClient.post<LabOrderDetail>(
    `/lab/orders/${id}/specimens`,
    { specimenBarcode },
  );
  return data;
}

export async function saveResults(
  id: string,
  results: { labOrderItemId: string; value: string }[],
): Promise<LabOrderDetail> {
  const { data } = await apiClient.post<LabOrderDetail>(
    `/lab/orders/${id}/results`,
    { results },
  );
  return data;
}

export async function verifyResults(id: string): Promise<LabOrderDetail> {
  const { data } = await apiClient.post<LabOrderDetail>(
    `/lab/orders/${id}/verify`,
  );
  return data;
}
