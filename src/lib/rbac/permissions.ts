/** Role codes — mirror backend RBAC (CLAUDE.md). */
export type Role =
  | "SUPER_ADMIN"
  | "DOCTOR"
  | "NURSE"
  | "RECEPTIONIST"
  | "PHARMACIST"
  | "LAB_TECH"
  | "BILLING_STAFF"
  | "PATIENT";

/** Permission strings: "<resource>:<action>". */
export type Permission =
  | "patient:read"
  | "patient:create"
  | "appointment:read"
  | "encounter:read"
  | "pharmacy:read"
  | "laboratory:read"
  | "billing:read"
  | "report:read"
  | "user:manage"
  | "settings:manage";

const ALL: Permission[] = [
  "patient:read",
  "patient:create",
  "appointment:read",
  "encounter:read",
  "pharmacy:read",
  "laboratory:read",
  "billing:read",
  "report:read",
  "user:manage",
  "settings:manage",
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: ALL,
  DOCTOR: [
    "patient:read",
    "patient:create",
    "appointment:read",
    "encounter:read",
    "laboratory:read",
    "report:read",
  ],
  NURSE: ["patient:read", "appointment:read", "encounter:read"],
  RECEPTIONIST: ["patient:read", "patient:create", "appointment:read"],
  PHARMACIST: ["patient:read", "pharmacy:read"],
  LAB_TECH: ["patient:read", "laboratory:read"],
  BILLING_STAFF: ["patient:read", "billing:read", "report:read"],
  PATIENT: ["patient:read", "appointment:read"],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
