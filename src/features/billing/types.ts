export type InvoiceStatus =
  | "DRAFT"
  | "ISSUED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "VOID"
  | "OVERDUE";

export type PaymentMethod =
  | "CASH"
  | "CARD"
  | "INSURANCE"
  | "MOBILE_PAYMENT"
  | "BANK_TRANSFER"
  | "WAIVER";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  referenceNo?: string | null;
  notes?: string | null;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  patientName: string;
  mrn: string;
  totalAmount: number;
  patientBalance: number;
  status: InvoiceStatus;
  issuedAt: string;
  paidAmount: number;
  notes?: string | null;
}

export interface InvoiceDetail extends Invoice {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  insuranceCoverage: number;
  items: InvoiceItem[];
  payments: Payment[];
}

export interface RecordPaymentPayload {
  amount: number;
  method: PaymentMethod;
  referenceNo?: string;
  notes?: string;
}

export interface SubmitClaimPayload {
  insuranceProvider: string;
  policyNumber: string;
}

export interface VoidInvoicePayload {
  reason: string;
}

