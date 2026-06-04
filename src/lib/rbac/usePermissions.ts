"use client";

import { hasPermission, type Permission } from "./permissions";
import { MOCK_USER } from "./mock-user";
import { normalizeRole } from "./role-code";

/**
 * Permission checks for the current user.
 * Backed by MOCK_USER now; later by the auth session.
 */
export function usePermissions() {
  const role = normalizeRole(MOCK_USER.role);
  return {
    role,
    user: MOCK_USER,
    can: (permission: Permission) => hasPermission(role, permission),
  };
}
