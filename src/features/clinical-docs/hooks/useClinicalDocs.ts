import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  administerMedication,
  createClinicalDoc,
  getClinicalDocs,
  getMarDetails,
  getPrescriptionPrint,
  getInvoicePrint,
  getLabResultPrint,
  getPatientPrint,
  getClinicalDocPrint,
  type ClinicalDocPayload,
  type AdministerMedicationPayload,
} from "../api/clinical-docs-api";

export const clinicalDocsKeys = {
  docs: (patientId: string) => ["clinical-docs", patientId] as const,
  mar: (patientId: string, date?: string) => ["mar-details", patientId, date] as const,
  printPrescription: (id: string) => ["print-prescription", id] as const,
  printInvoice: (id: string) => ["print-invoice", id] as const,
  printLabResult: (id: string) => ["print-lab-result", id] as const,
  printPatient: (id: string) => ["print-patient", id] as const,
  printClinicalDoc: (id: string) => ["print-clinical-doc", id] as const,
};

export function useCreateClinicalDoc() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ClinicalDocPayload) => createClinicalDoc(payload),
    onSuccess: () => {
      // Invalidate clinical docs
      queryClient.invalidateQueries({ queryKey: ["clinical-docs"] });
    },
  });
}

export function useClinicalDocs(patientId: string) {
  return useQuery({
    queryKey: clinicalDocsKeys.docs(patientId),
    queryFn: () => getClinicalDocs(patientId),
    enabled: !!patientId,
  });
}

export function useMarDetails(patientId: string, date?: string) {
  return useQuery({
    queryKey: clinicalDocsKeys.mar(patientId, date),
    queryFn: () => getMarDetails(patientId, date),
    enabled: !!patientId,
  });
}

export function useAdministerMedication(patientId: string, date?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdministerMedicationPayload) => administerMedication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicalDocsKeys.mar(patientId, date) });
    },
  });
}

export function usePrescriptionPrint(id: string) {
  return useQuery({
    queryKey: clinicalDocsKeys.printPrescription(id),
    queryFn: () => getPrescriptionPrint(id),
    enabled: !!id,
  });
}

export function useInvoicePrint(id: string) {
  return useQuery({
    queryKey: clinicalDocsKeys.printInvoice(id),
    queryFn: () => getInvoicePrint(id),
    enabled: !!id,
  });
}

export function useLabResultPrint(id: string) {
  return useQuery({
    queryKey: clinicalDocsKeys.printLabResult(id),
    queryFn: () => getLabResultPrint(id),
    enabled: !!id,
  });
}

export function usePatientPrint(id: string) {
  return useQuery({
    queryKey: clinicalDocsKeys.printPatient(id),
    queryFn: () => getPatientPrint(id),
    enabled: !!id,
  });
}

export function useClinicalDocPrint(id: string) {
  return useQuery({
    queryKey: clinicalDocsKeys.printClinicalDoc(id),
    queryFn: () => getClinicalDocPrint(id),
    enabled: !!id,
  });
}
