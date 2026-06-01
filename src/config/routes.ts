/** Typed route path constants — avoid hardcoded strings across the app. */
export const ROUTES = {
  patients: "/patients",
  appointments: "/appointments",
  encounters: "/encounters",
  pharmacy: "/pharmacy",
  laboratory: "/laboratory",
  billing: "/billing",
  reports: "/reports",
  users: "/users",
  settings: "/settings",
} as const;

export type RouteKey = keyof typeof ROUTES;
