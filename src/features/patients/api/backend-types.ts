/** Patient record shape returned by `GET /api/patients` (NestJS PatientResponseDto). */
export interface ApiPatient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  nrcNumber?: string;
  bloodType: string;
  primaryPhone: string;
  secondaryPhone?: string;
  email?: string;
  address?: string;
  city?: string;
  township?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAllergy {
  id: string;
  allergenType: "DRUG" | "FOOD" | "ENVIRONMENTAL" | "OTHER";
  allergenName: string;
  severity: "MILD" | "MODERATE" | "SEVERE" | "FATAL";
  reaction?: string;
}

export interface ApiEncounterSummary {
  id: string;
  encounterNo: string;
  date: string;
  type: string;
  doctor?: string;
  status: string;
}

/** Detail shape returned by `GET /api/patients/:id` (PatientDetailResponseDto). */
export interface ApiPatientDetail extends ApiPatient {
  allergies: ApiAllergy[];
  recentEncounters: ApiEncounterSummary[];
}

/** Payload accepted by `POST /api/patients` (CreatePatientDto). MRN is server-generated. */
export interface CreatePatientPayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  nrcNumber?: string;
  bloodType?: string;
  primaryPhone: string;
  secondaryPhone?: string;
  email?: string;
  address?: string;
  city?: string;
  township?: string;
}

export type UpdatePatientPayload = Partial<CreatePatientPayload>;
