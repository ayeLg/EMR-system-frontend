export type EncounterStatus = "OPEN" | "COMPLETED" | "CANCELLED";

export interface Encounter {
  id: string;
  encounterNo: string;
  patientName: string;
  mrn: string;
  doctorName: string;
  type: string;
  startTime: string;
  status: EncounterStatus;
}

export interface Vitals {
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  weightKg?: number;
}

export interface Diagnosis {
  icd10Code: string;
  description: string;
  type: "PRIMARY" | "SECONDARY" | "COMPLICATION" | "COMORBIDITY";
}

export interface LabOrderItem {
  id: string;
  labTestId: string;
  name: string;
  code: string;
}

export interface EncounterLabOrder {
  id: string;
  orderNo: string;
  priority: string;
  status: string;
  orderedAt: string;
  clinicalNotes?: string;
  items: LabOrderItem[];
}

export interface EncounterMedicalOrder {
  id: string;
  orderType: "RADIOLOGY" | "DIET" | "NURSING" | "REFERRAL";
  priority: string;
  description: string;
  notes?: string;
  orderedAt: string;
}

export interface EncounterDetail extends Encounter {
  allergies: { allergenName: string; severity: string }[];
  currentMeds: { name: string; dose: string }[];
  problemList: { icd10Code: string; description: string }[];
  pastEncounters: { encounterNo: string; date: string; type: string }[];
  vitals?: Vitals & { recordedAt: string };
  diagnoses: Diagnosis[];
  labOrders: EncounterLabOrder[];
  medicalOrders: EncounterMedicalOrder[];
}
