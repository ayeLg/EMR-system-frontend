import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  admitPatient,
  createProgressNote,
  dischargePatient,
  getInpatients,
  getWardOccupancy,
} from "../api/ipd-api";
import type { AdmitPatientPayload, CreateProgressNotePayload, DischargePatientPayload } from "../types";

export const ipdQueryKeys = {
  wards: ["ipd-wards"] as const,
  inpatients: ["inpatients"] as const,
};

export function useWardOccupancy() {
  return useQuery({
    queryKey: ipdQueryKeys.wards,
    queryFn: getWardOccupancy,
  });
}

export function useInpatients() {
  return useQuery({
    queryKey: ipdQueryKeys.inpatients,
    queryFn: getInpatients,
  });
}

export function useAdmitPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdmitPatientPayload) => admitPatient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ipdQueryKeys.wards });
      queryClient.invalidateQueries({ queryKey: ipdQueryKeys.inpatients });
    },
  });
}

export function useDischargePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DischargePatientPayload }) =>
      dischargePatient(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ipdQueryKeys.wards });
      queryClient.invalidateQueries({ queryKey: ipdQueryKeys.inpatients });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useCreateProgressNote() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateProgressNotePayload }) =>
      createProgressNote(id, payload),
  });
}
