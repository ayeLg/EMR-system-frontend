export type MasterResource =
  | "departments"
  | "services"
  | "medications"
  | "lab-tests"
  | "wards"
  | "insurance-providers";

export interface MasterRow {
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface DepartmentRow extends MasterRow {
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface ServiceRow extends MasterRow {
  code: string;
  name: string;
  category: string;
  price: number;
  taxRate?: number;
}

export interface MedicationRow extends MasterRow {
  code: string;
  genericName: string;
  strength: string;
  form: string;
  unit?: string;
}

export interface LabTestRow extends MasterRow {
  code: string;
  name: string;
  category: string;
  sampleType: string;
  price: number;
}

export interface WardRow extends MasterRow {
  code: string;
  name: string;
  departmentId: string;
  department: string;
  totalBeds: number;
}

export interface InsuranceProviderRow extends MasterRow {
  code: string;
  name: string;
  contact?: string | null;
}
