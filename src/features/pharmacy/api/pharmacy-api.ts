import { apiClient } from "@/lib/api/client";
import type { InventoryItem, Prescription } from "../types";

export interface MedicationOption {
  id: string;
  code: string;
  genericName: string;
  strength: string;
}

export async function getPrescriptions(): Promise<Prescription[]> {
  const { data } = await apiClient.get<Prescription[]>("/pharmacy/prescriptions");
  return data;
}

export async function getInventory(): Promise<InventoryItem[]> {
  const { data } = await apiClient.get<InventoryItem[]>("/pharmacy/inventory");
  return data;
}

export async function dispensePrescription(
  id: string,
  overrides: {
    coSignObtained?: boolean;
    ackModerate?: boolean;
    overrideReason?: string;
  },
): Promise<Prescription> {
  const { data } = await apiClient.post<Prescription>(
    `/pharmacy/prescriptions/${id}/dispense`,
    overrides,
  );
  return data;
}

export async function getMedications(): Promise<MedicationOption[]> {
  const { data } = await apiClient.get<MedicationOption[]>("/master-data/medications");
  return data;
}

export async function createInventory(dto: {
  medicationId: string;
  batchNumber: string;
  expiryDate: string;
  quantityOnHand: number;
  reorderLevel: number;
  unitCost: number;
  supplier?: string;
}): Promise<InventoryItem> {
  const { data } = await apiClient.post<InventoryItem>("/pharmacy/inventory", dto);
  return data;
}

export async function updateInventory(
  id: string,
  dto: {
    batchNumber?: string;
    expiryDate?: string;
    quantityOnHand?: number;
    reorderLevel?: number;
    unitCost?: number;
    supplier?: string;
  },
): Promise<InventoryItem> {
  const { data } = await apiClient.patch<InventoryItem>(`/pharmacy/inventory/${id}`, dto);
  return data;
}

export async function deleteInventory(id: string): Promise<{ deleted: boolean }> {
  const { data } = await apiClient.delete<{ deleted: boolean }>(`/pharmacy/inventory/${id}`);
  return data;
}
