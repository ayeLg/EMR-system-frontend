"use client";

import { useQuery } from "@tanstack/react-query";
import { getLabOrder, getLabOrders } from "../api/laboratory-api";

export function useLabOrders() {
  return useQuery({ queryKey: ["lab-orders"], queryFn: getLabOrders });
}

export function useLabOrder(id: string) {
  return useQuery({
    queryKey: ["lab-order", id],
    queryFn: () => getLabOrder(id),
    enabled: !!id,
  });
}
