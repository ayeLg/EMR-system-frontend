"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppointment, getAppointments } from "../api/appointments-api";

export function useAppointments() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: () => getAppointment(id),
    enabled: !!id,
  });
}
