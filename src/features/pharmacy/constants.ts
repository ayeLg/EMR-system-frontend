import type { InteractionSeverity, RxPriority, RxStatus } from "./types";

export const RX_STATUS_META: Record<RxStatus, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "blue" },
  PARTIALLY_DISPENSED: { label: "Partial", color: "gold" },
  DISPENSED: { label: "Dispensed", color: "green" },
  CANCELLED: { label: "Cancelled", color: "default" },
  EXPIRED: { label: "Expired", color: "red" },
};

export const PRIORITY_META: Record<RxPriority, { label: string; color: string }> = {
  ROUTINE: { label: "Routine", color: "default" },
  URGENT: { label: "Urgent", color: "orange" },
  STAT: { label: "STAT", color: "red" },
};

/** Drug-interaction severity → action (per clinical rules). */
export const INTERACTION_META: Record<
  InteractionSeverity,
  { label: string; color: string; action: string; blocks: boolean }
> = {
  CONTRAINDICATED: { label: "Contraindicated", color: "red", action: "BLOCK — cannot proceed", blocks: true },
  SEVERE: { label: "Severe", color: "volcano", action: "BLOCK + consultant co-sign", blocks: true },
  MODERATE: { label: "Moderate", color: "orange", action: "WARN — acknowledge + reason", blocks: false },
  MINOR: { label: "Minor", color: "gold", action: "INFO only", blocks: false },
};
