"use client";

import { useQuery } from "@tanstack/react-query";
import { getPatient } from "../api/patients-api";

export function usePatient(id: string) {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: () => getPatient(id),
    enabled: !!id,
  });
}
