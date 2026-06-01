export type LabStatus =
  | "ORDERED"
  | "SPECIMEN_COLLECTED"
  | "IN_PROCESS"
  | "RESULTED"
  | "VERIFIED"
  | "CANCELLED";

export type LabPriority = "ROUTINE" | "URGENT" | "STAT";

export interface LabTestItem {
  id: string;
  testName: string;
  unit: string;
  refLow: number;
  refHigh: number;
  criticalLow: number;
  criticalHigh: number;
  value?: number;
}

export interface LabOrder {
  id: string;
  orderNo: string;
  patientName: string;
  mrn: string;
  orderedBy: string;
  orderedAt: string;
  priority: LabPriority;
  status: LabStatus;
}

export interface LabOrderDetail extends LabOrder {
  clinicalNotes?: string;
  items: LabTestItem[];
}
