import type { LabPriority, LabStatus } from "./types";

export const LAB_STATUS_META: Record<LabStatus, { label: string; color: string }> = {
  ORDERED: { label: "Ordered", color: "blue" },
  SPECIMEN_COLLECTED: { label: "Collected", color: "cyan" },
  IN_PROCESS: { label: "In process", color: "gold" },
  RESULTED: { label: "Resulted", color: "geekblue" },
  VERIFIED: { label: "Verified", color: "green" },
  CANCELLED: { label: "Cancelled", color: "default" },
};

export const LAB_PRIORITY_META: Record<LabPriority, { label: string; color: string }> = {
  ROUTINE: { label: "Routine", color: "default" },
  URGENT: { label: "Urgent", color: "orange" },
  STAT: { label: "STAT", color: "red" },
};

export type ResultFlag = "NORMAL" | "ABNORMAL" | "CRITICAL";

export function evaluateResult(
  value: number | undefined,
  item: { refLow: number; refHigh: number; criticalLow: number; criticalHigh: number },
): ResultFlag | null {
  if (value == null || Number.isNaN(value)) return null;
  if (value <= item.criticalLow || value >= item.criticalHigh) return "CRITICAL";
  if (value < item.refLow || value > item.refHigh) return "ABNORMAL";
  return "NORMAL";
}

export const FLAG_META: Record<ResultFlag, { label: string; color: string }> = {
  NORMAL: { label: "Normal", color: "green" },
  ABNORMAL: { label: "Abnormal", color: "orange" },
  CRITICAL: { label: "Critical", color: "red" },
};
