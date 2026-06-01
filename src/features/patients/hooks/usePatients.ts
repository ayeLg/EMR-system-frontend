"use client";

import { useQuery } from "@tanstack/react-query";
import { getPatients } from "../api/patients-api";

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });
}
