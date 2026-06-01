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
