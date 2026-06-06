import dayjs from "dayjs";
import type {
  ApiPatient,
  ApiPatientDetail,
  CreatePatientPayload,
} from "./api/backend-types";
import type { Patient, PatientDetail } from "./types";
import type { RegistrationValues } from "./schemas";

function isApiPatient(value: ApiPatient | Patient): value is ApiPatient {
  return "firstName" in value && "lastName" in value;
}

function isApiPatientDetail(
  value: ApiPatientDetail | PatientDetail,
): value is ApiPatientDetail {
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
    primaryPhone: patient.primaryPhone,
    gender: patient.gender,
    status: patient.isActive ? "ACTIVE" : "INACTIVE",
  };
}

export function mapPatientDetailResponse(
  patient: ApiPatientDetail | PatientDetail,
): PatientDetail {
  if (!isApiPatientDetail(patient)) {
    return patient;
  }
  return mapApiPatientToDetail(patient);
}

export function mapApiPatientToDetail(patient: ApiPatientDetail): PatientDetail {
  const base = mapApiPatientToPatient(patient);
  return {
    ...base,
    dateOfBirth: patient.dateOfBirth,
    nrcNumber: patient.nrcNumber,
    bloodType: patient.bloodType || "UNKNOWN",
    email: patient.email,
    address: patient.address,
    city: patient.city,
    township: patient.township,
    allergies: patient.allergies.map((allergy) => ({
      id: allergy.id,
      allergenType: allergy.allergenType,
      allergenName: allergy.allergenName,
      severity: allergy.severity,
      reaction: allergy.reaction ?? "",
    })),
    recentEncounters: patient.recentEncounters.map((encounter) => ({
      id: encounter.id,
      encounterNo: encounter.encounterNo,
      date: encounter.date,
      type: encounter.type,
      doctor: encounter.doctor ?? "—",
      status: encounter.status,
    })),
  };
}

/** Drops empty optional strings so we don't send "" for omittable fields. */
function trimOptional(value?: string): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

/**
 * Builds the `POST /patients` payload from the registration form values.
 * MRN is omitted (server-generated); emergency/insurance fields are not part of
 * the patient create contract and are intentionally excluded.
 */
export function toCreatePayload(values: RegistrationValues): CreatePatientPayload {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    dateOfBirth: dayjs(values.dateOfBirth).format("YYYY-MM-DD"),
    gender: values.gender,
    nrcNumber: trimOptional(values.nrcNumber),
    bloodType: values.bloodType,
    primaryPhone: values.primaryPhone.trim(),
    email: trimOptional(values.email),
    address: trimOptional(values.address),
    city: trimOptional(values.city),
    township: trimOptional(values.township),
  };
}
