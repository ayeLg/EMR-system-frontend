/**
 * Frontend mirrors of backend enums + display metadata (label i18n key + AntD tag color).
 * Keeps status badges / tags consistent everywhere.
 */

export type PatientStatus = "ACTIVE" | "INACTIVE";
export type Gender = "MALE" | "FEMALE" | "OTHER";

interface EnumMeta {
  /** i18n key (namespace-qualified, e.g. "status.active") */
  labelKey: string;
  /** AntD Tag color */
  color: string;
}

export const PATIENT_STATUS: Record<PatientStatus, EnumMeta> = {
  ACTIVE: { labelKey: "status.active", color: "green" },
  INACTIVE: { labelKey: "status.inactive", color: "orange" },
};

export const GENDER: Record<Gender, EnumMeta> = {
  MALE: { labelKey: "gender.male", color: "blue" },
  FEMALE: { labelKey: "gender.female", color: "magenta" },
  OTHER: { labelKey: "gender.other", color: "default" },
};
