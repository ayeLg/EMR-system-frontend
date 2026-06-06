import type {
  ApiPatient,
  ApiPatientDetail,
  CreatePatientPayload,
  UpdatePatientPayload,
} from "@/features/patients/api/backend-types";

function nameParts(full: string): { firstName: string; lastName: string } {
  const [firstName, ...rest] = full.split(" ");
  return { firstName: firstName ?? full, lastName: rest.join(" ") };
}

function apiPatient(
  id: string,
  mrn: string,
  fullName: string,
  primaryPhone: string,
  gender: ApiPatient["gender"],
  isActive: boolean,
): ApiPatient {
  const { firstName, lastName } = nameParts(fullName);
  const now = new Date().toISOString();
  return {
    id,
    mrn,
    firstName,
    lastName,
    dateOfBirth: "1988-03-12",
    gender,
    bloodType: "O_POS",
    primaryPhone,
    isActive,
    createdAt: now,
    updatedAt: now,
  };
}

/** In-memory store so create/update/delete mock handlers are stateful per session. */
export const MOCK_PATIENTS: ApiPatient[] = [
  apiPatient("1", "MRN-0100043", "Aung Aung", "09-771234567", "MALE", true),
  apiPatient("2", "MRN-0100044", "Hla Hla", "09-425678901", "FEMALE", true),
  apiPatient("3", "MRN-0100045", "Kyaw Min", "09-960112233", "MALE", false),
  apiPatient("4", "MRN-0100046", "Su Su Lwin", "09-788990011", "FEMALE", true),
  apiPatient("5", "MRN-0100047", "Min Thant", "09-451122334", "MALE", true),
];

export function getMockPatientDetail(id: string): ApiPatientDetail | undefined {
  const base = MOCK_PATIENTS.find((p) => p.id === id);
  if (!base) return undefined;
  return {
    ...base,
    nrcNumber: "12/ABC(N)123456",
    email: "patient@example.com",
    address: "No. 42, Pyay Road",
    city: "Yangon",
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

let mockSeq = MOCK_PATIENTS.length;

export function addMockPatient(payload: CreatePatientPayload): ApiPatient {
  mockSeq += 1;
  const now = new Date().toISOString();
  const created: ApiPatient = {
    id: String(mockSeq),
    mrn: `MRN-${String(mockSeq).padStart(7, "0")}`,
    bloodType: "UNKNOWN",
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...payload,
  };
  MOCK_PATIENTS.unshift(created);
  return created;
}

export function updateMockPatient(
  id: string,
  payload: UpdatePatientPayload,
): ApiPatient | undefined {
  const patient = MOCK_PATIENTS.find((p) => p.id === id);
  if (!patient) return undefined;
  Object.assign(patient, payload, { updatedAt: new Date().toISOString() });
  return patient;
}

export function removeMockPatient(id: string): boolean {
  const patient = MOCK_PATIENTS.find((p) => p.id === id);
  if (!patient) return false;
  patient.isActive = false;
  return true;
}
