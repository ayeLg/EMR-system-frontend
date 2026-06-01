import { apiClient } from "@/lib/api/client";
import type { StaffUser } from "../types";

export async function getStaff(): Promise<StaffUser[]> {
  const { data } = await apiClient.get<StaffUser[]>("/users");
  return data;
}
