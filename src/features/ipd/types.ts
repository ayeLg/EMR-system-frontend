export interface WardOccupancy {
  id: string;
  code: string;
  name: string;
  totalBeds: number;
  occupiedBeds: number;
  occupiedBedsList: string[];
}

export interface Inpatient {
  id: string;
  patientName: string;
  patientId: string;
  mrn: string;
  ward: string;
  wardId: string;
  bed: string;
  admittedAt: string;
  diagnosis: string;
  attendingDoctorName: string;
}

export interface AdmitPatientPayload {
  patientId: string;
  wardId: string;
  bedNumber: string;
  admissionDate: string;
  attendingDoctorId: string;
  diagnosis: string;
  icd10Code?: string;
}

export interface DischargePatientPayload {
  dischargeSummary: string;
  dischargeDate: string;
}

export interface CreateProgressNotePayload {
  content: string;
}
