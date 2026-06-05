import type { Permission, Role } from "@/lib/rbac/permissions";
import { isPermission } from "@/lib/rbac/permissions";

const CODE_TO_FRONTEND: Record<string, Role> = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "SUPER_ADMIN",
  DOCTOR: "DOCTOR",
  NURSE: "NURSE",
  RECEPTIONIST: "RECEPTIONIST",
  PHARMACIST: "PHARMACIST",
  LAB_TECH: "LAB_TECH",
  BILLING_STAFF: "BILLING_STAFF",
  PATIENT: "PATIENT",
  super_admin: "SUPER_ADMIN",
  admin: "SUPER_ADMIN",
  doctor: "DOCTOR",
  nurse: "NURSE",
  receptionist: "RECEPTIONIST",
  pharmacist: "PHARMACIST",
  lab_tech: "LAB_TECH",
  billing_staff: "BILLING_STAFF",
  patient: "PATIENT",
};

export function mapBackendRole(roleOrCode: string): Role {
  return CODE_TO_FRONTEND[roleOrCode] ?? "RECEPTIONIST";
}

export function parsePermissions(keys: string[]): Permission[] {
  return keys.filter(isPermission);
}
