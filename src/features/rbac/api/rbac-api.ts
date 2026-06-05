import { apiClient } from "@/lib/api/client";
import type { RbacPermission, RbacRole } from "../types";

export async function listRbacPermissions(): Promise<RbacPermission[]> {
  const { data } = await apiClient.get<RbacPermission[]>("/rbac/permissions");
  return data;
}

export async function listRbacRoles(): Promise<RbacRole[]> {
  const { data } = await apiClient.get<RbacRole[]>("/rbac/roles");
  return data;
}

export async function setRolePermissions(
  roleId: string,
  permissionIds: string[],
): Promise<RbacRole> {
  const { data } = await apiClient.put<RbacRole>(`/rbac/roles/${roleId}/permissions`, {
    permissionIds,
  });
  return data;
}
