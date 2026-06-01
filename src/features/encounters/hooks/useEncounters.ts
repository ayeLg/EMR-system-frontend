"use client";

import { useQuery } from "@tanstack/react-query";
import { getEncounter, getEncounters } from "../api/encounters-api";

export function useEncounters() {
  return useQuery({ queryKey: ["encounters"], queryFn: getEncounters });
}

export function useEncounter(id: string) {
  return useQuery({
    queryKey: ["encounter", id],
    queryFn: () => getEncounter(id),
    enabled: !!id,
  });
}
