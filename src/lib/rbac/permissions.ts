import {
  CRUD_COLUMNS,
  RBAC_MODULES,
  type CrudAction,
  permissionKey,
} from "@/features/rbac/rbac-modules";

/** Role codes — mirror database `roles.code`. */
export type Role =
  | "SUPER_ADMIN"
  | "DOCTOR"
  | "NURSE"
  | "RECEPTIONIST"
  | "PHARMACIST"
  | "LAB_TECH"
  | "BILLING_STAFF"
  | "PATIENT";

export type Permission =
  | `${(typeof RBAC_MODULES)[number]["module"]}:${CrudAction}`
  | "user:manage"
  | "settings:manage";

export const ALL_PERMISSIONS: Permission[] = [
  ...RBAC_MODULES.flatMap((m) =>
    CRUD_COLUMNS.map((c) => permissionKey(m.module, c.action) as Permission),
  ),
  "user:manage",
  "settings:manage",
];

const LEGACY_MANAGE: Record<string, string> = {
  "settings:manage": "settings",
  "user:manage": "user",
};

/** True if the user has the exact key or equivalent CRUD / legacy manage. */
export function canAction(
  permissions: readonly string[],
  module: string,
  action: CrudAction,
): boolean {
  const key = permissionKey(module, action);
  if (permissions.includes(key)) return true;
  if (permissions.includes(`${module}:manage`)) return true;
  return false;
}

export function hasPermission(
  permissions: readonly string[],
  permission: Permission | string,
): boolean {
  if (permissions.includes(permission)) return true;

  const legacyModule = LEGACY_MANAGE[permission];
  if (legacyModule) {
    return CRUD_COLUMNS.some((c) => canAction(permissions, legacyModule, c.action));
  }

  const [module, action] = permission.split(":");
  if (!module || !action) return false;

  if (action === "manage") {
    return (
      permissions.includes(`${module}:manage`) ||
      CRUD_COLUMNS.some((c) => canAction(permissions, module, c.action))
    );
  }

  if (
    action === "read" ||
    action === "create" ||
    action === "update" ||
    action === "delete"
  ) {
    return canAction(permissions, module, action);
  }

  return false;
}

function crud(
  module: string,
  actions: CrudAction[],
): Permission[] {
  return actions.map((a) => permissionKey(module, a) as Permission);
}

/** Fallback when session permissions are not loaded (MSW / offline). */
export const DEFAULT_ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: ALL_PERMISSIONS.filter(
    (p) => !p.endsWith(":manage"),
  ) as Permission[],
  DOCTOR: [
    ...crud("patient", ["read", "create", "update"]),
    ...crud("appointment", ["read", "create", "update"]),
    ...crud("encounter", ["read", "create", "update"]),
    ...crud("laboratory", ["read"]),
    ...crud("radiology", ["read", "create", "update"]),
    ...crud("report", ["read"]),
  ],
  NURSE: [
    ...crud("patient", ["read"]),
    ...crud("appointment", ["read"]),
    ...crud("encounter", ["read", "update"]),
  ],
  RECEPTIONIST: [
    ...crud("patient", ["read", "create"]),
    ...crud("appointment", ["read", "create", "update"]),
  ],
  PHARMACIST: [
    ...crud("patient", ["read"]),
    ...crud("pharmacy", ["read", "create", "update"]),
  ],
  LAB_TECH: [
    ...crud("patient", ["read"]),
    ...crud("laboratory", ["read", "create", "update"]),
  ],
  BILLING_STAFF: [
    ...crud("patient", ["read"]),
    ...crud("billing", ["read", "create", "update"]),
    ...crud("report", ["read"]),
  ],
  PATIENT: [
    ...crud("patient", ["read"]),
    ...crud("appointment", ["read"]),
  ],
};

export function isPermission(value: string): value is Permission {
  return ALL_PERMISSIONS.includes(value as Permission);
}
