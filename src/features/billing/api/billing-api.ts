import { apiClient } from "@/lib/api/client";
import type { Invoice, InvoiceDetail } from "../types";

export async function getInvoices(): Promise<Invoice[]> {
  const { data } = await apiClient.get<Invoice[]>("/billing/invoices");
  return data;
}

export async function getInvoice(id: string): Promise<InvoiceDetail> {
  const { data } = await apiClient.get<InvoiceDetail>(`/billing/invoices/${id}`);
  return data;
}
