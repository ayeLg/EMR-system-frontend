export type RxStatus =
  | "PENDING"
  | "PARTIALLY_DISPENSED"
  | "DISPENSED"
  | "CANCELLED"
  | "EXPIRED";

export type RxPriority = "ROUTINE" | "URGENT" | "STAT";

export type InteractionSeverity =
  | "CONTRAINDICATED"
  | "SEVERE"
  | "MODERATE"
  | "MINOR";

export interface RxItem {
  medication: string;
  dose: string;
  route: string;
  frequency: string;
  quantityPrescribed: number;
}

export interface Interaction {
  drugs: string;
  severity: InteractionSeverity;
  description: string;
}

export interface Prescription {
  id: string;
  rxNumber: string;
  patientName: string;
  mrn: string;
  prescribedBy: string;
  prescribedAt: string;
  status: RxStatus;
  priority: RxPriority;
  items: RxItem[];
  interactions: Interaction[];
}

export interface InventoryItem {
  id: string;
  name: string;
  batchNumber: string;
  expiryDate: string;
  quantityOnHand: number;
  reorderLevel: number;
}
