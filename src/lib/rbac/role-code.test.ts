import { describe, expect, it } from "vitest";
import { normalizeRole, toBackendRole } from "./role-code";

describe("role-code", () => {
  it("normalizes backend lower-snake role codes to frontend role codes", () => {
    expect(normalizeRole("super_admin")).toBe("SUPER_ADMIN");
    expect(normalizeRole("billing_staff")).toBe("BILLING_STAFF");
    expect(normalizeRole("lab_tech")).toBe("LAB_TECH");
  });

  it("keeps frontend role codes stable", () => {
    expect(normalizeRole("DOCTOR")).toBe("DOCTOR");
  });

  it("converts frontend role codes back to backend lower-snake codes", () => {
    expect(toBackendRole("SUPER_ADMIN")).toBe("super_admin");
    expect(toBackendRole("RECEPTIONIST")).toBe("receptionist");
  });

  it("rejects unknown role codes", () => {
    expect(() => normalizeRole("owner")).toThrow("Unknown role code");
  });
});
