import { apiClient } from "@/lib/api/client";
import type {
  Invoice,
  InvoiceDetail,
  RecordPaymentPayload,
  SubmitClaimPayload,
  VoidInvoicePayload,
} from "../types";

export async function getInvoices(): Promise<Invoice[]> {
  const { data } = await apiClient.get<Invoice[]>("/billing/invoices");
  return data;
}

export async function getInvoice(id: string): Promise<InvoiceDetail> {
  const { data } = await apiClient.get<InvoiceDetail>(`/billing/invoices/${id}`);
  return data;
}

export async function recordPayment(
  id: string,
  payload: RecordPaymentPayload
): Promise<unknown> {
  const { data } = await apiClient.post<unknown>(
    `/billing/invoices/${id}/payments`,
    payload
  );
  return data;
}

export async function submitClaim(
  id: string,
  payload: SubmitClaimPayload
): Promise<unknown> {
  const { data } = await apiClient.post<unknown>(
    `/billing/invoices/${id}/claims`,
    payload
  );
  return data;
}

export async function voidInvoice(
  id: string,
  payload: VoidInvoicePayload
): Promise<unknown> {
  const { data } = await apiClient.post<unknown>(
    `/billing/invoices/${id}/void`,
    payload
  );
  return data;
}

