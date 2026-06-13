import {
  TeamOutlined,
  CalendarOutlined,
  SolutionOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  SnippetsOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  DollarOutlined,
  PrinterOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  ScheduleOutlined,
  UserOutlined,
  AuditOutlined,
  BellOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import { ROUTES } from "./routes";
import type { Permission } from "@/lib/rbac/permissions";

export type NavGroup = "clinical" | "operations" | "admin";

export interface NavItem {
  key: string;
  /** i18n key under "nav" */
  labelKey: string;
  icon: ReactNode;
  path: string;
  group: NavGroup;
  permission: Permission;
}

export const NAV_ITEMS: NavItem[] = [
  // Clinical
  { key: "patients", labelKey: "patients", icon: <TeamOutlined />, path: ROUTES.patients, group: "clinical", permission: "patient:read" },
  { key: "appointments", labelKey: "appointments", icon: <CalendarOutlined />, path: ROUTES.appointments, group: "clinical", permission: "appointment:read" },
  { key: "nurseQueue", labelKey: "nurseQueue", icon: <SolutionOutlined />, path: ROUTES.nurseQueue, group: "clinical", permission: "appointment:read" },
  { key: "encounters", labelKey: "encounters", icon: <FileTextOutlined />, path: ROUTES.encounters, group: "clinical", permission: "encounter:read" },
  { key: "ipd", labelKey: "ipd", icon: <ApartmentOutlined />, path: ROUTES.ipd, group: "clinical", permission: "encounter:read" },
  { key: "clinicalDocs", labelKey: "clinicalDocs", icon: <SnippetsOutlined />, path: ROUTES.clinicalDocs, group: "clinical", permission: "encounter:read" },
  // Operations
  { key: "pharmacy", labelKey: "pharmacy", icon: <MedicineBoxOutlined />, path: ROUTES.pharmacy, group: "operations", permission: "pharmacy:read" },
  { key: "laboratory", labelKey: "laboratory", icon: <ExperimentOutlined />, path: ROUTES.laboratory, group: "operations", permission: "laboratory:read" },
  { key: "radiology", labelKey: "radiology", icon: <ExperimentOutlined />, path: ROUTES.radiology, group: "operations", permission: "radiology:read" },
  { key: "billing", labelKey: "billing", icon: <DollarOutlined />, path: ROUTES.billing, group: "operations", permission: "billing:read" },
  { key: "printPreviews", labelKey: "printPreviews", icon: <PrinterOutlined />, path: ROUTES.printPreviews, group: "operations", permission: "patient:read" },
  // Admin
  { key: "reports", labelKey: "reports", icon: <BarChartOutlined />, path: ROUTES.reports, group: "admin", permission: "report:read" },
  { key: "masterData", labelKey: "masterData", icon: <DatabaseOutlined />, path: ROUTES.masterData, group: "admin", permission: "settings:manage" },
  { key: "doctorSchedules", labelKey: "doctorSchedules", icon: <ScheduleOutlined />, path: ROUTES.doctorSchedules, group: "admin", permission: "settings:manage" },
  { key: "users", labelKey: "users", icon: <UserOutlined />, path: ROUTES.users, group: "admin", permission: "user:manage" },
  { key: "rbac", labelKey: "rbac", icon: <SafetyCertificateOutlined />, path: ROUTES.rbac, group: "admin", permission: "settings:update" },
  { key: "auditLogs", labelKey: "auditLogs", icon: <AuditOutlined />, path: ROUTES.auditLogs, group: "admin", permission: "settings:manage" },
  { key: "notifications", labelKey: "notifications", icon: <BellOutlined />, path: ROUTES.notifications, group: "admin", permission: "patient:read" },
  { key: "settings", labelKey: "settings", icon: <SettingOutlined />, path: ROUTES.settings, group: "admin", permission: "settings:manage" },
];

export const NAV_GROUP_ORDER: NavGroup[] = ["clinical", "operations", "admin"];
