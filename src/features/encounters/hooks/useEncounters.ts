"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SoapValues, VitalsValues } from "../schemas";
import type { Diagnosis, EncounterStatus } from "../types";
import {
  addEncounterDiagnosis,
  getEncounter,
  getEncounters,
  recordEncounterVitals,
  saveSoapNote,
  updateEncounterStatus,
  createLabOrder,
  createMedicalOrder,
  getLabTests,
  type CreateLabOrderPayload,
  type CreateMedicalOrderPayload,
} from "../api/encounters-api";

export function useEncounters() {
  return useQuery({ queryKey: ["encounters"], queryFn: getEncounters });
}

export function useEncounter(id: string) {
  return useQuery({
    queryKey: ["encounter", id],
    queryFn: () => getEncounter(id),
    enabled: !!id,
  });
}

export function useSaveSoapNote(encounterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: SoapValues) => saveSoapNote(encounterId, values),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["encounter", encounterId] }),
  });
}

export function useRecordEncounterVitals(encounterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: VitalsValues) =>
      recordEncounterVitals(encounterId, values),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["encounter", encounterId] }),
  });
}

export function useAddEncounterDiagnosis(encounterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (diagnosis: Diagnosis) =>
      addEncounterDiagnosis(encounterId, diagnosis),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["encounter", encounterId] }),
  });
}

export function useUpdateEncounterStatus(encounterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: Extract<EncounterStatus, "COMPLETED" | "CANCELLED">) =>
      updateEncounterStatus(encounterId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["encounter", encounterId] });
      queryClient.invalidateQueries({ queryKey: ["encounters"] });
    },
  });
}

export function useLabTests() {
  return useQuery({ queryKey: ["lab-tests"], queryFn: getLabTests });
}

export function useCreateLabOrder(encounterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLabOrderPayload) =>
      createLabOrder(encounterId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["encounter", encounterId] }),
  });
}

export function useCreateMedicalOrder(encounterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMedicalOrderPayload) =>
      createMedicalOrder(encounterId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["encounter", encounterId] }),
  });
}
