import type { Appointment } from "@/features/appointments/types";

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: "1", appointmentNo: "APT-0600015", patientName: "Aung Aung", mrn: "MRN-0100043", doctorName: "Dr. Aung Aung", department: "Cardiology", scheduledAt: "2026-06-01 09:00", type: "OPD", status: "SCHEDULED", chiefComplaint: "Chest pain" },
  { id: "2", appointmentNo: "APT-0600016", patientName: "Hla Hla", mrn: "MRN-0100044", doctorName: "Dr. Hla Hla", department: "General Medicine", scheduledAt: "2026-06-01 09:30", type: "FOLLOWUP", status: "ARRIVED", chiefComplaint: "Follow-up hypertension" },
  { id: "3", appointmentNo: "APT-0600017", patientName: "Kyaw Min", mrn: "MRN-0100045", doctorName: "Dr. Kyaw Min", department: "Orthopedics", scheduledAt: "2026-06-01 10:00", type: "OPD", status: "IN_PROGRESS", chiefComplaint: "Knee pain" },
  { id: "4", appointmentNo: "APT-0600018", patientName: "Su Su Lwin", mrn: "MRN-0100046", doctorName: "Dr. Aung Aung", department: "Pediatrics", scheduledAt: "2026-05-31 14:00", type: "OPD", status: "COMPLETED", chiefComplaint: "Fever" },
  { id: "5", appointmentNo: "APT-0600019", patientName: "Min Thant", mrn: "MRN-0100047", doctorName: "Dr. Hla Hla", department: "General Medicine", scheduledAt: "2026-05-31 15:30", type: "EMERGENCY", status: "NO_SHOW", chiefComplaint: "Abdominal pain" },
];
