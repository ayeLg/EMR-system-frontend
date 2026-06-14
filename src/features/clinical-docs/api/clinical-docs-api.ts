import { apiClient } from "@/lib/api/client";

export interface ClinicalDocPayload {
  encounterId: string;
  noteType: "REFERRAL" | "CERTIFICATE" | "DISCHARGE";
  content: Record<string, unknown>;
}

export interface ClinicalDocResponse {
  id: string;
  encounterId: string;
  authorId: string;
  noteType: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  encounter?: {
    encounterNo: string;
    startTime: string;
    encounterType: string;
  };
}

export interface MarItem {
  id: string;
  prescriptionId: string;
  medicationId: string;
  medication: string;
  dose: string;
  route: string;
  frequency: string;
  durationDays: number | null;
  given: Record<string, boolean>;
}

export interface AdministerMedicationPayload {
  encounterId: string;
  prescriptionItemId: string;
  medicationName: string;
  slot: "08:00" | "14:00" | "20:00";
  adminDate: string; // YYYY-MM-DD
}

// Printer hydration interfaces
export interface PrescriptionPrintResponse {
  rxNumber: string;
  prescribedAt: string;
  patient?: {
    firstName: string;
    lastName: string;
    mrn: string;
  };
  prescribedBy?: {
    fullName: string;
  };
  items?: Array<{
    id: string;
    medication?: {
      genericName: string;
      brandName?: string;
    };
    dose: string;
    route: string;
    frequency: string;
    durationDays?: number | null;
    instructions?: string | null;
  }>;
}

export interface InvoicePrintResponse {
  invoiceNo: string;
  createdAt: string;
  subtotal: number | string;
  discountAmount: number | string;
  taxAmount: number | string;
  totalAmount: number | string;
  paidAmount: number | string;
  patientBalance: number | string;
  patient?: {
    firstName: string;
    lastName: string;
    mrn: string;
  };
  createdBy?: {
    fullName: string;
  };
  items?: Array<{
    id: string;
    description: string;
    quantity: number;
    total: number | string;
  }>;
}

export interface LabResultPrintResponse {
  orderNo: string;
  orderedAt: string;
  collectedAt?: string | null;
  patient?: {
    firstName: string;
    lastName: string;
    mrn: string;
  };
  orderedBy?: {
    fullName: string;
  };
  items?: Array<{
    id: string;
    labTest?: {
      name: string;
    };
    result?: {
      resultValue?: string;
      unit?: string;
      isCritical?: boolean;
      isAbnormal?: boolean;
    } | null;
  }>;
}

export interface PatientPrintResponse {
  mrn: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  bloodType: string;
  primaryPhone: string;
}

export interface ClinicalDocPrintResponse {
  noteType: string;
  content: string;
  createdAt: string;
  encounter?: {
    patient?: {
      firstName: string;
      lastName: string;
      mrn: string;
    };
    attendingDoctor?: {
      fullName: string;
    };
  };
}

export async function createClinicalDoc(
  payload: ClinicalDocPayload,
): Promise<ClinicalDocResponse> {
  const { data } = await apiClient.post<ClinicalDocResponse>(
    "/clinical-docs",
    payload,
  );
  return data;
}

export async function getClinicalDocs(
  patientId: string,
): Promise<ClinicalDocResponse[]> {
  const { data } = await apiClient.get<ClinicalDocResponse[]>(
    `/clinical-docs/patient/${patientId}`,
  );
  return data;
}

export async function getMarDetails(
  patientId: string,
  date?: string,
): Promise<MarItem[]> {
  const { data } = await apiClient.get<MarItem[]>(
    `/clinical-docs/mar/patient/${patientId}`,
    {
      params: date ? { date } : undefined,
    },
  );
  return data;
}

export async function administerMedication(
  payload: AdministerMedicationPayload,
): Promise<unknown> {
  const { data } = await apiClient.post<unknown>(
    "/clinical-docs/mar/administer",
    payload,
  );
  return data;
}

// Printer data hydration endpoints
export async function getPrescriptionPrint(id: string): Promise<PrescriptionPrintResponse> {
  const { data } = await apiClient.get<PrescriptionPrintResponse>(
    `/clinical-docs/print/prescription/${id}`,
  );
  return data;
}

export async function getInvoicePrint(id: string): Promise<InvoicePrintResponse> {
  const { data } = await apiClient.get<InvoicePrintResponse>(
    `/clinical-docs/print/invoice/${id}`,
  );
  return data;
}

export async function getLabResultPrint(id: string): Promise<LabResultPrintResponse> {
  const { data } = await apiClient.get<LabResultPrintResponse>(
    `/clinical-docs/print/lab-order/${id}`,
  );
  return data;
}

export async function getPatientPrint(id: string): Promise<PatientPrintResponse> {
  const { data } = await apiClient.get<PatientPrintResponse>(
    `/clinical-docs/print/patient/${id}`,
  );
  return data;
}

export async function getClinicalDocPrint(id: string): Promise<ClinicalDocPrintResponse> {
  const { data } = await apiClient.get<ClinicalDocPrintResponse>(
    `/clinical-docs/print/clinical-doc/${id}`,
  );
  return data;
}
