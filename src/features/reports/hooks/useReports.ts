"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../api/reports-api";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: getDashboardStats,
  });
}
