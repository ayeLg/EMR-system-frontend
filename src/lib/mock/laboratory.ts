import type { LabOrder, LabOrderDetail } from "@/features/laboratory/types";

export const MOCK_LAB_ORDERS: LabOrder[] = [
  { id: "1", orderNo: "LAB-0400031", patientName: "Aung Aung", mrn: "MRN-0100043", orderedBy: "Dr. Aung Aung", orderedAt: "2026-05-31 09:25", priority: "STAT", status: "IN_PROCESS" },
  { id: "2", orderNo: "LAB-0400032", patientName: "Hla Hla", mrn: "MRN-0100044", orderedBy: "Dr. Hla Hla", orderedAt: "2026-05-31 09:40", priority: "ROUTINE", status: "SPECIMEN_COLLECTED" },
  { id: "3", orderNo: "LAB-0400033", patientName: "Su Su Lwin", mrn: "MRN-0100046", orderedBy: "Dr. Aung Aung", orderedAt: "2026-05-31 10:10", priority: "URGENT", status: "ORDERED" },
];

export function getMockLabOrderDetail(id: string): LabOrderDetail | undefined {
  const base = MOCK_LAB_ORDERS.find((o) => o.id === id);
  if (!base) return undefined;
  return {
    ...base,
    clinicalNotes: "Rule out anemia / electrolyte imbalance.",
    items: [
      { id: "t1", testName: "Hemoglobin", unit: "g/dL", refLow: 13.5, refHigh: 17.5, criticalLow: 7, criticalHigh: 20 },
      { id: "t2", testName: "WBC", unit: "10³/µL", refLow: 4, refHigh: 11, criticalLow: 1, criticalHigh: 30 },
      { id: "t3", testName: "Potassium", unit: "mmol/L", refLow: 3.5, refHigh: 5.1, criticalLow: 2.5, criticalHigh: 6.5 },
      { id: "t4", testName: "Sodium", unit: "mmol/L", refLow: 135, refHigh: 145, criticalLow: 120, criticalHigh: 160 },
    ],
  };
}
