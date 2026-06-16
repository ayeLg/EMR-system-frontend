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

// ICD-10 codes come from the backend catalog (GET /master-data/icd10).
// Prescribable drugs come from the medication master (GET /pharmacy/medications),
// used directly in the prescription modal — no hardcoded drug list.
