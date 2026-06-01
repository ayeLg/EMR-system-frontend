import type { AppointmentStatus, AppointmentType } from "./types";

export const APPT_STATUS_META: Record<
  AppointmentStatus,
  { label: string; color: string }
> = {
  SCHEDULED: { label: "Scheduled", color: "blue" },
  ARRIVED: { label: "Arrived", color: "cyan" },
  IN_PROGRESS: { label: "In progress", color: "gold" },
  COMPLETED: { label: "Completed", color: "green" },
  CANCELLED: { label: "Cancelled", color: "default" },
  NO_SHOW: { label: "No-show", color: "red" },
};

export const APPT_TYPE_LABEL: Record<AppointmentType, string> = {
  OPD: "OPD",
  IPD: "IPD",
  FOLLOWUP: "Follow-up",
  EMERGENCY: "Emergency",
  TELECONSULT: "Teleconsult",
};

export const TYPE_OPTIONS = (
  Object.keys(APPT_TYPE_LABEL) as AppointmentType[]
).map((v) => ({ label: APPT_TYPE_LABEL[v], value: v }));

export const STATUS_FILTER_OPTIONS = (
  Object.keys(APPT_STATUS_META) as AppointmentStatus[]
).map((v) => ({ label: APPT_STATUS_META[v].label, value: v }));

export const DEPARTMENT_OPTIONS = [
  { label: "General Medicine", value: "GEN_MED" },
  { label: "Cardiology", value: "CARDIO" },
  { label: "Pediatrics", value: "PEDS" },
  { label: "Orthopedics", value: "ORTHO" },
];

export const DOCTOR_OPTIONS = [
  { label: "Dr. Aung Aung", value: "d1" },
  { label: "Dr. Hla Hla", value: "d2" },
  { label: "Dr. Kyaw Min", value: "d3" },
];

export const PATIENT_OPTIONS = [
  { label: "Aung Aung · MRN-0100043", value: "1" },
  { label: "Hla Hla · MRN-0100044", value: "2" },
  { label: "Kyaw Min · MRN-0100045", value: "3" },
  { label: "Su Su Lwin · MRN-0100046", value: "4" },
  { label: "Min Thant · MRN-0100047", value: "5" },
];
