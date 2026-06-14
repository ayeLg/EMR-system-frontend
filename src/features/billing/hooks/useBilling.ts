"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInvoice,
  getInvoices,
  recordPayment,
  submitClaim,
  voidInvoice,
} from "../api/billing-api";
import type {
  RecordPaymentPayload,
  SubmitClaimPayload,
  VoidInvoicePayload,
} from "../types";

export function useInvoices() {
  return useQuery({ queryKey: ["invoices"], queryFn: getInvoices });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoice(id),
    enabled: !!id,
  });
}

export function useRecordPayment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RecordPaymentPayload) => recordPayment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
    },
  });
}

export function useSubmitClaim(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitClaimPayload) => submitClaim(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
    },
  });
}

export function useVoidInvoice(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VoidInvoicePayload) => voidInvoice(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
    },
  });
}

