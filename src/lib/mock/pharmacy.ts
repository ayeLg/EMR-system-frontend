import type { InventoryItem, Prescription } from "@/features/pharmacy/types";

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: "1",
    rxNumber: "RX-0300009",
    patientName: "Aung Aung",
    mrn: "MRN-0100043",
    prescribedBy: "Dr. Aung Aung",
    prescribedAt: "2026-05-31 09:20",
    status: "PENDING",
    priority: "STAT",
    items: [
      { medication: "Warfarin", dose: "5mg", route: "ORAL", frequency: "OD", quantityPrescribed: 30 },
      { medication: "Aspirin", dose: "100mg", route: "ORAL", frequency: "OD", quantityPrescribed: 30 },
    ],
    interactions: [
      { drugs: "Warfarin + Aspirin", severity: "SEVERE", description: "Increased bleeding risk." },
    ],
  },
  {
    id: "2",
    rxNumber: "RX-0300010",
    patientName: "Hla Hla",
    mrn: "MRN-0100044",
    prescribedBy: "Dr. Hla Hla",
    prescribedAt: "2026-05-31 09:35",
    status: "PENDING",
    priority: "ROUTINE",
    items: [
      { medication: "Amlodipine", dose: "5mg", route: "ORAL", frequency: "OD", quantityPrescribed: 30 },
      { medication: "Simvastatin", dose: "20mg", route: "ORAL", frequency: "ON", quantityPrescribed: 30 },
    ],
    interactions: [
      { drugs: "Amlodipine + Simvastatin", severity: "MODERATE", description: "Risk of myopathy; limit simvastatin dose." },
    ],
  },
  {
    id: "3",
    rxNumber: "RX-0300011",
    patientName: "Su Su Lwin",
    mrn: "MRN-0100046",
    prescribedBy: "Dr. Aung Aung",
    prescribedAt: "2026-05-31 10:05",
    status: "PENDING",
    priority: "URGENT",
    items: [
      { medication: "Paracetamol", dose: "500mg", route: "ORAL", frequency: "QID", quantityPrescribed: 20 },
    ],
    interactions: [],
  },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: "1", name: "Paracetamol 500mg", batchNumber: "B-2401", expiryDate: "2027-03-01", quantityOnHand: 1200, reorderLevel: 200 },
  { id: "2", name: "Amlodipine 5mg", batchNumber: "B-2388", expiryDate: "2026-06-20", quantityOnHand: 80, reorderLevel: 100 },
  { id: "3", name: "Warfarin 5mg", batchNumber: "B-2350", expiryDate: "2026-06-12", quantityOnHand: 40, reorderLevel: 50 },
  { id: "4", name: "Amoxicillin 250mg", batchNumber: "B-2410", expiryDate: "2028-01-15", quantityOnHand: 600, reorderLevel: 150 },
  { id: "5", name: "Simvastatin 20mg", batchNumber: "B-2399", expiryDate: "2027-11-30", quantityOnHand: 300, reorderLevel: 100 },
  { id: "6", name: "Aspirin 100mg", batchNumber: "B-2360", expiryDate: "2026-06-05", quantityOnHand: 25, reorderLevel: 80 },
];
