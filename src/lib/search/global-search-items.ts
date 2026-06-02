import type { ReactNode } from "react";
import { NAV_ITEMS } from "@/config/nav";
import { ROUTES } from "@/config/routes";
import type { Permission } from "@/lib/rbac/permissions";

export type GlobalSearchGroup = "navigation" | "actions" | "patients";

export interface GlobalSearchItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  group: GlobalSearchGroup;
  icon?: ReactNode;
  keywords: string[];
}

interface BuildIndexOptions {
  can: (permission: Permission) => boolean;
  navLabel: (key: string) => string;
  actionLabels: {
    registerPatient: string;
    bookAppointment: string;
  };
}

export function buildStaticSearchIndex({
  can,
  navLabel,
  actionLabels,
}: BuildIndexOptions): GlobalSearchItem[] {
  const navigation: GlobalSearchItem[] = NAV_ITEMS.filter((item) =>
    can(item.permission),
  ).map((item) => ({
    id: `nav-${item.key}`,
    title: navLabel(item.labelKey),
    href: item.path,
    group: "navigation" as const,
    icon: item.icon,
    keywords: [item.key, item.path, navLabel(item.labelKey)],
  }));

  const actions: GlobalSearchItem[] = [];

  if (can("patient:create")) {
    actions.push({
      id: "action-register-patient",
      title: actionLabels.registerPatient,
      href: `${ROUTES.patients}/new`,
      group: "actions",
      keywords: ["register", "new", "patient", ROUTES.patients],
    });
  }

  if (can("appointment:read")) {
    actions.push({
      id: "action-book-appointment",
      title: actionLabels.bookAppointment,
      href: `${ROUTES.appointments}/new`,
      group: "actions",
      keywords: ["book", "appointment", "schedule", ROUTES.appointments],
    });
  }

  return [...navigation, ...actions];
}

export function buildPatientSearchItems(
  patients: Array<{ id: string; fullName: string; mrn: string; primaryPhone: string }>,
): GlobalSearchItem[] {
  return patients.map((p) => ({
    id: `patient-${p.id}`,
    title: p.fullName,
    subtitle: `${p.mrn} · ${p.primaryPhone}`,
    href: `${ROUTES.patients}/${p.id}`,
    group: "patients" as const,
    keywords: [p.fullName, p.mrn, p.primaryPhone, p.id],
  }));
}

export function filterSearchItems(
  items: GlobalSearchItem[],
  query: string,
  limit = 12,
): GlobalSearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return items.filter((item) => item.group !== "patients").slice(0, limit);
  }

  return items
    .filter((item) =>
      item.keywords.some((k) => k.toLowerCase().includes(q)) ||
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q),
    )
    .slice(0, limit);
}
