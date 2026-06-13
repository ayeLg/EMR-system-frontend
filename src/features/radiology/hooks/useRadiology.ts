"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelRadiologyOrder,
  getRadiologyOrder,
  getRadiologyOrders,
  startRadiologyScan,
  submitRadiologyResults,
  type SubmitRadiologyResultsPayload,
} from "../api/radiology-api";

export function useRadiologyOrders() {
  return useQuery({
    queryKey: ["radiology-orders"],
    queryFn: getRadiologyOrders,
  });
}

export function useRadiologyOrder(id: string) {
  return useQuery({
    queryKey: ["radiology-order", id],
    queryFn: () => getRadiologyOrder(id),
    enabled: !!id,
  });
}

export function useStartRadiologyScan(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => startRadiologyScan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["radiology-orders"] });
      queryClient.invalidateQueries({ queryKey: ["radiology-order", id] });
    },
  });
}

export function useSubmitRadiologyResults(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitRadiologyResultsPayload) =>
      submitRadiologyResults(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["radiology-orders"] });
      queryClient.invalidateQueries({ queryKey: ["radiology-order", id] });
    },
  });
}

export function useCancelRadiologyOrder(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cancelRadiologyOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["radiology-orders"] });
      queryClient.invalidateQueries({ queryKey: ["radiology-order", id] });
    },
  });
}
