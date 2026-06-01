import type { Gender, PatientStatus } from "@/config/enums";

export interface Patient {
  id: string;
  mrn: string;
  fullName: string;
  primaryPhone: string;
  gender: Gender;
  status: PatientStatus;
}

export interface PatientAllergy {
  id: string;
  allergenType: "DRUG" | "FOOD" | "ENVIRONMENTAL" | "OTHER";
  allergenName: string;
  severity: "MILD" | "MODERATE" | "SEVERE" | "FATAL";
  reaction: string;
}

export interface EncounterSummary {
  id: string;
  encounterNo: string;
  date: string;
  type: string;
  doctor: string;
  status: string;
}

export interface PatientDetail extends Patient {
  dateOfBirth: string;
  nrcNumber?: string;
  bloodType: string;
  email?: string;
  address?: string;
  township?: string;
  allergies: PatientAllergy[];
  recentEncounters: EncounterSummary[];
}
