import { ALL_PERMISSIONS } from "./permissions";
import type { CurrentUser } from "./current-user";

/** Fallback when not signed in (MSW-only paths). */
export const MOCK_USER: CurrentUser = {
  id: "mock",
  email: "doctor@example.com",
  name: "Dr. Aung Aung",
  role: "SUPER_ADMIN",
  roleCode: "SUPER_ADMIN",
  permissions: ALL_PERMISSIONS,
};
