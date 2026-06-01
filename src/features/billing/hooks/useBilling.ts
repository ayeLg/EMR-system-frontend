"use client";

import { useQuery } from "@tanstack/react-query";
import { getInvoice, getInvoices } from "../api/billing-api";

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
