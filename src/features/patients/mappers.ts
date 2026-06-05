import type { ApiPatient } from "./api/backend-types";
import type { Patient, PatientDetail } from "./types";

function isApiPatient(value: ApiPatient | Patient): value is ApiPatient {
  return "firstName" in value && "lastName" in value;
}

function fullNameFromApi(patient: ApiPatient): string {
  const name = [patient.firstName, patient.lastName].filter(Boolean).join(" ").trim();
  return name || patient.mrn;
}

/** Normalizes NestJS or MSW mock payloads into the list `Patient` shape. */
export function mapPatientResponse(patient: ApiPatient | Patient): Patient {
  if (!isApiPatient(patient)) {
    return patient;
  }
  return mapApiPatientToPatient(patient);
}

export function mapApiPatientToPatient(patient: ApiPatient): Patient {
  return {
    id: patient.id,
    mrn: patient.mrn,
    fullName: fullNameFromApi(patient),
    primaryPhone: "",
    gender: undefined,
    status: undefined,
  };
}

export function mapPatientDetailResponse(
  patient: ApiPatient | PatientDetail,
): PatientDetail {
  if (!isApiPatient(patient)) {
    return patient;
  }
  return mapApiPatientToDetail(patient);
}

export function mapApiPatientToDetail(patient: ApiPatient): PatientDetail {
  const base = mapApiPatientToPatient(patient);
  return {
    ...base,
    dateOfBirth: patient.dateOfBirth,
    bloodType: "UNKNOWN",
    allergies: [],
    recentEncounters: [],
  };
}
