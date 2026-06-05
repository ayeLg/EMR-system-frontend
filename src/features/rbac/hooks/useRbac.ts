"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listRbacPermissions, listRbacRoles, setRolePermissions } from "../api/rbac-api";
import { authQueryKeys } from "@/features/auth/hooks/useCurrentUser";

export const rbacQueryKeys = {
  permissions: ["rbac", "permissions"] as const,
  roles: ["rbac", "roles"] as const,
};

export function useRbacPermissions() {
  return useQuery({
    queryKey: rbacQueryKeys.permissions,
    queryFn: listRbacPermissions,
    staleTime: 60_000,
  });
}

export function useRbacRoles() {
  return useQuery({
    queryKey: rbacQueryKeys.roles,
    queryFn: listRbacRoles,
    staleTime: 30_000,
  });
}

export function useSetRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: string;
      permissionIds: string[];
    }) => setRolePermissions(roleId, permissionIds),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: rbacQueryKeys.roles });
      void queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
    },
  });
}
