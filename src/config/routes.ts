/** Typed route path constants — avoid hardcoded strings across the app. */
export const ROUTES = {
  login: "/login",
  patients: "/patients",
  appointments: "/appointments",
  nurseQueue: "/nurse-queue",
  encounters: "/encounters",
  ipd: "/ipd",
  clinicalDocs: "/clinical-docs",
  pharmacy: "/pharmacy",
  laboratory: "/laboratory",
  radiology: "/radiology",
  billing: "/billing",
  printPreviews: "/print-previews",
  reports: "/reports",
  masterData: "/master-data",
  rbac: "/rbac",
  doctorSchedules: "/doctor-schedules",
  users: "/users",
  auditLogs: "/audit-logs",
  notifications: "/notifications",
  settings: "/settings",
} as const;

export type RouteKey = keyof typeof ROUTES;
