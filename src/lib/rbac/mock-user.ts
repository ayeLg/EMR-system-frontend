import type { Role } from "./permissions";

export interface CurrentUser {
  name: string;
  role: Role;
}

/**
 * Mock authenticated user for the UI-only phase.
 * Change `role` to verify RBAC gating (e.g. "RECEPTIONIST" hides pharmacy/lab).
 * Later this comes from GET /api/me + the auth session.
 */
export const MOCK_USER: CurrentUser = {
  name: "Dr. Aung Aung",
  role: "DOCTOR",
};
