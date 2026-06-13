import type { OrderPriority, OrderStatus } from "./types";

export const RADIOLOGY_STATUS_META: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "blue" },
  IN_PROGRESS: { label: "In progress", color: "gold" },
  COMPLETED: { label: "Completed", color: "green" },
  CANCELLED: { label: "Cancelled", color: "default" },
  ON_HOLD: { label: "On hold", color: "purple" },
};

export const RADIOLOGY_PRIORITY_META: Record<OrderPriority, { label: string; color: string }> = {
  ROUTINE: { label: "Routine", color: "default" },
  URGENT: { label: "Urgent", color: "orange" },
  STAT: { label: "STAT", color: "red" },
};
export type RadiologyStatus = OrderStatus;
export type RadiologyPriority = OrderPriority;
