export interface WardSummary {
  id: string;
  name: string;
  totalBeds: number;
  occupiedBeds: number;
}

export interface Inpatient {
  id: string;
  patientName: string;
  mrn: string;
  ward: string;
  bed: string;
  admittedAt: string;
  diagnosis: string;
}

export const WARD_SUMMARY: WardSummary[] = [
  { id: "1", name: "Ward A (General)", totalBeds: 24, occupiedBeds: 18 },
  { id: "2", name: "ICU", totalBeds: 8, occupiedBeds: 6 },
  { id: "3", name: "Pediatric Ward", totalBeds: 16, occupiedBeds: 9 },
];

export const INPATIENTS: Inpatient[] = [
  { id: "1", patientName: "Aung Aung", mrn: "MRN-0100043", ward: "ICU", bed: "ICU-03", admittedAt: "2026-05-30", diagnosis: "Acute MI (I21)" },
  { id: "2", patientName: "Su Su Lwin", mrn: "MRN-0100046", ward: "Ward A (General)", bed: "A-12", admittedAt: "2026-05-29", diagnosis: "Pneumonia (J18.9)" },
  { id: "3", patientName: "Min Thant", mrn: "MRN-0100047", ward: "Pediatric Ward", bed: "P-05", admittedAt: "2026-05-31", diagnosis: "Gastroenteritis (A09)" },
];
