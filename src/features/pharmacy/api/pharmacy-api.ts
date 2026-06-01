import { apiClient } from "@/lib/api/client";
import type { InventoryItem, Prescription } from "../types";

export async function getPrescriptions(): Promise<Prescription[]> {
  const { data } = await apiClient.get<Prescription[]>("/pharmacy/prescriptions");
  return data;
}

export async function getInventory(): Promise<InventoryItem[]> {
  const { data } = await apiClient.get<InventoryItem[]>("/pharmacy/inventory");
  return data;
}
