import type { Encounter, EncounterDetail } from "@/features/encounters/types";

export const MOCK_ENCOUNTERS: Encounter[] = [
  { id: "1", encounterNo: "ENC-0200102", patientName: "Aung Aung", mrn: "MRN-0100043", doctorName: "Dr. Aung Aung", type: "OPD", startTime: "2026-05-31 09:10", status: "OPEN" },
  { id: "2", encounterNo: "ENC-0200101", patientName: "Hla Hla", mrn: "MRN-0100044", doctorName: "Dr. Hla Hla", type: "OPD", startTime: "2026-05-31 08:40", status: "OPEN" },
  { id: "3", encounterNo: "ENC-0200098", patientName: "Su Su Lwin", mrn: "MRN-0100046", doctorName: "Dr. Aung Aung", type: "OPD", startTime: "2026-05-30 14:05", status: "COMPLETED" },
];

export function getMockEncounterDetail(id: string): EncounterDetail | undefined {
  const base = MOCK_ENCOUNTERS.find((e) => e.id === id);
  if (!base) return undefined;
  return {
    ...base,
    allergies: [
      { allergenName: "Penicillin", severity: "SEVERE" },
      { allergenName: "Peanuts", severity: "MODERATE" },
    ],
    currentMeds: [
      { name: "Amlodipine", dose: "5mg OD" },
      { name: "Metformin", dose: "500mg BD" },
    ],
    problemList: [
      { icd10Code: "I10", description: "Essential hypertension" },
      { icd10Code: "E11", description: "Type 2 diabetes mellitus" },
    ],
    pastEncounters: [
      { encounterNo: "ENC-0200098", date: "2026-04-11", type: "OPD" },
      { encounterNo: "ENC-0200071", date: "2026-02-03", type: "OPD" },
    ],
    vitals: {
      recordedAt: "2026-05-31 09:05",
      systolicBp: 138,
      diastolicBp: 88,
      heartRate: 82,
      respiratoryRate: 18,
      temperature: 36.8,
      oxygenSaturation: 98,
      weightKg: 72,
      heightCm: 170,
      bmi: 24.9,
      painScore: 2,
      bloodGlucose: 110,
      notes: "Vitals re-checked during consultation.",
    },
    diagnoses: [],
    labOrders: [],
    medicalOrders: [],
    soapNotes: [],
  };
}
