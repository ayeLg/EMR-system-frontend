"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collectSpecimen,
  getLabOrder,
  getLabOrders,
  saveResults,
  verifyResults,
} from "../api/laboratory-api";

export function useLabOrders() {
  return useQuery({ queryKey: ["lab-orders"], queryFn: getLabOrders });
}

export function useLabOrder(id: string) {
  return useQuery({
    queryKey: ["lab-order", id],
    queryFn: () => getLabOrder(id),
    enabled: !!id,
  });
}

export function useCollectSpecimen(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (specimenBarcode?: string) => collectSpecimen(id, specimenBarcode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-orders"] });
      queryClient.invalidateQueries({ queryKey: ["lab-order", id] });
    },
  });
}

export function useSaveResults(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (results: { labOrderItemId: string; value: string }[]) =>
      saveResults(id, results),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-orders"] });
      queryClient.invalidateQueries({ queryKey: ["lab-order", id] });
    },
  });
}

export function useVerifyResults(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => verifyResults(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lab-orders"] });
      queryClient.invalidateQueries({ queryKey: ["lab-order", id] });
    },
  });
}
