import type { EncounterStatus } from "./types";

export const ENC_STATUS_META: Record<
  EncounterStatus,
  { label: string; color: string }
> = {
  OPEN: { label: "Open", color: "processing" },
  COMPLETED: { label: "Completed", color: "green" },
  CANCELLED: { label: "Cancelled", color: "default" },
};

export const DIAGNOSIS_TYPE_OPTIONS = [
  { label: "Primary", value: "PRIMARY" },
  { label: "Secondary", value: "SECONDARY" },
  { label: "Complication", value: "COMPLICATION" },
  { label: "Comorbidity", value: "COMORBIDITY" },
];

export const ICD10_OPTIONS = [
  { label: "I10 · Essential hypertension", value: "I10" },
  { label: "E11 · Type 2 diabetes mellitus", value: "E11" },
  { label: "J18.9 · Pneumonia, unspecified", value: "J18.9" },
  { label: "K29.7 · Gastritis, unspecified", value: "K29.7" },
  { label: "M54.5 · Low back pain", value: "M54.5" },
  { label: "R51 · Headache", value: "R51" },
];

/** Drugs that trigger the allergy cross-check demo (patient is allergic to Penicillin). */
export const PRESCRIBABLE_DRUGS = [
  { label: "Penicillin", value: "Penicillin", allergen: true },
  { label: "Paracetamol", value: "Paracetamol", allergen: false },
  { label: "Amoxicillin", value: "Amoxicillin", allergen: true },
  { label: "Omeprazole", value: "Omeprazole", allergen: false },
];
