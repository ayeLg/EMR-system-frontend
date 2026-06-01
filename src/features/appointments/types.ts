export type AppointmentType =
  | "OPD"
  | "IPD"
  | "FOLLOWUP"
  | "EMERGENCY"
  | "TELECONSULT";

export type AppointmentStatus =
  | "SCHEDULED"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface Appointment {
  id: string;
  appointmentNo: string;
  patientName: string;
  mrn: string;
  doctorName: string;
  department: string;
  scheduledAt: string;
  type: AppointmentType;
  status: AppointmentStatus;
  chiefComplaint?: string;
}
