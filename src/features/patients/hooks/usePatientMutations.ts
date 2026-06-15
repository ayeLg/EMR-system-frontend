"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPatient,
  deletePatient,
  updatePatient,
  addAllergy,
} from "../api/patients-api";
import type { AddAllergyPayload } from "../api/patients-api";
import type {
  CreatePatientPayload,
  UpdatePatientPayload,
} from "../api/backend-types";

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePatientPayload) => createPatient(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

export function useUpdatePatient(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePatientPayload) => updatePatient(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["patients"] });
      void queryClient.invalidateQueries({ queryKey: ["patient", id] });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

export function useAddAllergy(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddAllergyPayload) => addAllergy(patientId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
    },
  });
}
