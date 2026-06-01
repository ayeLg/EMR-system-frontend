export type NotificationType =
  | "APPOINTMENT_REMINDER"
  | "LAB_RESULT_READY"
  | "CRITICAL_VALUE"
  | "MEDICATION_DUE"
  | "SYSTEM_ALERT";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: "1", type: "CRITICAL_VALUE", title: "Critical lab value", body: "Potassium 7.0 mmol/L — Aung Aung (LAB-0400031)", isRead: false, createdAt: "2 min ago" },
  { id: "2", type: "LAB_RESULT_READY", title: "Lab result ready", body: "Lipid panel resulted — Hla Hla", isRead: false, createdAt: "15 min ago" },
  { id: "3", type: "APPOINTMENT_REMINDER", title: "Patient arrived", body: "Kyaw Min checked in for 10:00 OPD", isRead: false, createdAt: "20 min ago" },
  { id: "4", type: "MEDICATION_DUE", title: "Prescription pending", body: "RX-0300010 awaiting dispensing", isRead: true, createdAt: "1 hr ago" },
  { id: "5", type: "SYSTEM_ALERT", title: "Backup completed", body: "Nightly database backup succeeded", isRead: true, createdAt: "3 hr ago" },
];
