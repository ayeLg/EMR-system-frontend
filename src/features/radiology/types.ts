export type OrderPriority = "ROUTINE" | "URGENT" | "STAT";
export type OrderStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "ON_HOLD";

export interface RadiologyDetails {
  findings: string;
  impression: string;
  imagingUrl?: string;
  performedBy: string;
  performedAt: string;
}

export interface RadiologyOrder {
  id: string;
  encounterId: string;
  patientName: string;
  mrn: string;
  orderedBy: string;
  orderedAt: string;
  priority: OrderPriority;
  status: OrderStatus;
  description: string;
  notes?: string;
  completedAt?: string;
  details?: RadiologyDetails;
}
