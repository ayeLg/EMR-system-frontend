import type { Role } from "./permissions";

const BACKEND_TO_FRONTEND_ROLE: Record<string, Role> = {
  super_admin: "SUPER_ADMIN",
  doctor: "DOCTOR",
  nurse: "NURSE",
  receptionist: "RECEPTIONIST",
  pharmacist: "PHARMACIST",
  lab_tech: "LAB_TECH",
  billing_staff: "BILLING_STAFF",
  patient: "PATIENT",
};

const FRONTEND_ROLES = new Set<Role>([
  "SUPER_ADMIN",
  "DOCTOR",
  "NURSE",
  "RECEPTIONIST",
  "PHARMACIST",
  "LAB_TECH",
  "BILLING_STAFF",
  "PATIENT",
]);

export function normalizeRole(role: string): Role {
  if (FRONTEND_ROLES.has(role as Role)) {
    return role as Role;
  }

  const normalized = BACKEND_TO_FRONTEND_ROLE[role.trim().toLowerCase()];
  if (!normalized) {
    throw new Error(`Unknown role code: ${role}`);
  }
  return normalized;
}

export function toBackendRole(role: Role): string {
  return role.toLowerCase();
}
