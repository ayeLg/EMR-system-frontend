import type { Invoice, InvoiceDetail, Payment } from "@/features/billing/types";

export const MOCK_INVOICES: Invoice[] = [
  { id: "1", invoiceNo: "INV-0500007", patientName: "Aung Aung", mrn: "MRN-0100043", totalAmount: 85000, patientBalance: 60000, status: "PARTIALLY_PAID", issuedAt: "2026-05-31 11:00", paidAmount: 25000 },
  { id: "2", invoiceNo: "INV-0500008", patientName: "Hla Hla", mrn: "MRN-0100044", totalAmount: 32000, patientBalance: 0, status: "PAID", issuedAt: "2026-05-31 10:20", paidAmount: 32000 },
  { id: "3", invoiceNo: "INV-0500009", patientName: "Su Su Lwin", mrn: "MRN-0100046", totalAmount: 120000, patientBalance: 120000, status: "ISSUED", issuedAt: "2026-05-30 16:45", paidAmount: 0 },
];

export function getMockInvoiceDetail(id: string): InvoiceDetail | undefined {
  const base = MOCK_INVOICES.find((i) => i.id === id);
  if (!base) return undefined;

  let payments: Payment[] = [];
  if (base.status === "PARTIALLY_PAID") {
    payments = [
      { id: "p1", amount: 25000, method: "CASH", paidAt: "2026-05-31 11:05" },
    ];
  } else if (base.status === "PAID") {
    payments = [
      { id: "p1", amount: base.totalAmount, method: "CARD", paidAt: "2026-05-31 10:25" },
    ];
  }

  return {
    ...base,
    subtotal: 90000,
    discountAmount: 10000,
    taxAmount: 5000,
    insuranceCoverage: 0,
    items: [
      { id: "li1", description: "OPD Consultation — Cardiology", quantity: 1, unitPrice: 30000, total: 30000 },
      { id: "li2", description: "ECG", quantity: 1, unitPrice: 25000, total: 25000 },
      { id: "li3", description: "Lab — Lipid panel", quantity: 1, unitPrice: 35000, total: 35000 },
    ],
    payments,
  };
}
