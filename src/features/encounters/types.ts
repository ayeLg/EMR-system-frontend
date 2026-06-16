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
  respiratoryRate?: number;
  temperature?: number; // maps to vital_signs.temperature_celsius
  oxygenSaturation?: number;
  weightKg?: number;
  heightCm?: number;
  bmi?: number; // auto-calculated from weight + height
  painScore?: number; // 0-10
  bloodGlucose?: number;
  notes?: string;
}

export interface Diagnosis {
  icd10Code: string;
  description: string;
  type: "PRIMARY" | "SECONDARY" | "COMPLICATION" | "COMORBIDITY";
  notes?: string;
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

export interface SoapNoteRecord {
  id: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  isAmended: boolean;
  amendedFrom?: string;
  createdAt: string;
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
  soapNotes: SoapNoteRecord[];
}
