"use client";

import { useQuery } from "@tanstack/react-query";
import { getInventory, getPrescriptions } from "../api/pharmacy-api";

export function usePrescriptions() {
  return useQuery({ queryKey: ["prescriptions"], queryFn: getPrescriptions });
}

export function useInventory() {
  return useQuery({ queryKey: ["inventory"], queryFn: getInventory });
}
