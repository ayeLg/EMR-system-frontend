import type { InvoiceStatus } from "./types";

export const INVOICE_STATUS_META: Record<
  InvoiceStatus,
  { label: string; color: string }
> = {
  DRAFT: { label: "Draft", color: "default" },
  ISSUED: { label: "Issued", color: "blue" },
  PARTIALLY_PAID: { label: "Partially paid", color: "gold" },
  PAID: { label: "Paid", color: "green" },
  VOID: { label: "Void", color: "default" },
  OVERDUE: { label: "Overdue", color: "red" },
};

export const PAYMENT_METHOD_OPTIONS = [
  { label: "Cash", value: "CASH" },
  { label: "Card", value: "CARD" },
  { label: "Insurance", value: "INSURANCE" },
  { label: "Mobile payment", value: "MOBILE_PAYMENT" },
  { label: "Bank transfer", value: "BANK_TRANSFER" },
  { label: "Waiver", value: "WAIVER" },
];

/** Display currency (Myanmar Kyat). */
export function formatMMK(amount: number): string {
  return `${amount.toLocaleString("en-US")} Ks`;
}
