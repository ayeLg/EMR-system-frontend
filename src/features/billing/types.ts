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
}

export interface InvoiceDetail extends Invoice {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  insuranceCoverage: number;
  items: InvoiceItem[];
  payments: Payment[];
}
