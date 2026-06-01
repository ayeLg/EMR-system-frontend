import type { Patient, PatientDetail } from "@/features/patients/types";

export const MOCK_PATIENTS: Patient[] = [
  { id: "1", mrn: "MRN-0100043", fullName: "Aung Aung", primaryPhone: "09-771234567", gender: "MALE", status: "ACTIVE" },
  { id: "2", mrn: "MRN-0100044", fullName: "Hla Hla", primaryPhone: "09-425678901", gender: "FEMALE", status: "ACTIVE" },
  { id: "3", mrn: "MRN-0100045", fullName: "Kyaw Min", primaryPhone: "09-960112233", gender: "MALE", status: "INACTIVE" },
  { id: "4", mrn: "MRN-0100046", fullName: "Su Su Lwin", primaryPhone: "09-788990011", gender: "FEMALE", status: "ACTIVE" },
  { id: "5", mrn: "MRN-0100047", fullName: "Min Thant", primaryPhone: "09-451122334", gender: "MALE", status: "ACTIVE" },
];

export function getMockPatientDetail(id: string): PatientDetail | undefined {
  const base = MOCK_PATIENTS.find((p) => p.id === id);
  if (!base) return undefined;
  return {
    ...base,
    dateOfBirth: "1988-03-12",
    nrcNumber: "12/ABC(N)123456",
    bloodType: "O_POS",
    email: "patient@example.com",
    address: "No. 42, Pyay Road",
    township: "Sanchaung",
    allergies: [
      { id: "a1", allergenType: "DRUG", allergenName: "Penicillin", severity: "SEVERE", reaction: "Anaphylaxis" },
      { id: "a2", allergenType: "FOOD", allergenName: "Peanuts", severity: "MODERATE", reaction: "Hives" },
    ],
    recentEncounters: [
      { id: "e1", encounterNo: "ENC-0200102", date: "2026-05-20", type: "OPD", doctor: "Dr. Aung Aung", status: "COMPLETED" },
      { id: "e2", encounterNo: "ENC-0200098", date: "2026-04-11", type: "OPD", doctor: "Dr. Hla Hla", status: "COMPLETED" },
    ],
  };
}
