import type { StaffUser } from "@/features/users/types";

export const MOCK_STAFF: StaffUser[] = [
  { id: "1", fullName: "Dr. Aung Aung", employeeId: "EMP-001", email: "aung@hospital.mm", role: "DOCTOR", department: "Cardiology", status: "ACTIVE" },
  { id: "2", fullName: "Dr. Hla Hla", employeeId: "EMP-002", email: "hla@hospital.mm", role: "DOCTOR", department: "General Medicine", status: "ACTIVE" },
  { id: "3", fullName: "Nurse Mya Mya", employeeId: "EMP-014", email: "mya@hospital.mm", role: "NURSE", department: "Ward A", status: "ACTIVE" },
  { id: "4", fullName: "Ko Zaw (Pharmacy)", employeeId: "EMP-021", email: "zaw@hospital.mm", role: "PHARMACIST", department: "Pharmacy", status: "ACTIVE" },
  { id: "5", fullName: "Su Su (Reception)", employeeId: "EMP-030", email: "su@hospital.mm", role: "RECEPTIONIST", department: "Front Desk", status: "PENDING" },
];
