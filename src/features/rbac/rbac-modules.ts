/** UI labels for RBAC matrix rows (mirrors backend `RBAC_MODULES`). */
export const RBAC_MODULES = [
  { module: "patient", label: "Patients" },
  { module: "appointment", label: "Appointments" },
  { module: "encounter", label: "Encounters" },
  { module: "pharmacy", label: "Pharmacy" },
  { module: "laboratory", label: "Laboratory" },
  { module: "radiology", label: "Radiology" },
  { module: "billing", label: "Billing" },
  { module: "report", label: "Reports" },
  { module: "user", label: "Users" },
  { module: "settings", label: "Settings & master data" },
] as const;

export const CRUD_COLUMNS = [
  { action: "read", label: "List" },
  { action: "create", label: "Create" },
  { action: "update", label: "Edit" },
  { action: "delete", label: "Delete" },
] as const;

export type CrudAction = (typeof CRUD_COLUMNS)[number]["action"];

export function permissionKey(module: string, action: CrudAction): string {
  return `${module}:${action}`;
}
