"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  getAppointments,
  updateAppointment,
  type CreateAppointmentPayload,
  type UpdateAppointmentPayload,
} from "../api/appointments-api";

export const appointmentQueryKeys = {
  list: ["appointments"] as const,
  detail: (id: string) => ["appointment", id] as const,
};

export function useAppointments() {
  return useQuery({
    queryKey: appointmentQueryKeys.list,
    queryFn: getAppointments,
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: appointmentQueryKeys.detail(id),
    queryFn: () => getAppointment(id),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) =>
      createAppointment(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: appointmentQueryKeys.list,
      });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAppointmentPayload;
    }) => updateAppointment(id, payload),
    onSuccess: (_appointment, { id }) => {
      void queryClient.invalidateQueries({
        queryKey: appointmentQueryKeys.list,
      });
      void queryClient.invalidateQueries({
        queryKey: appointmentQueryKeys.detail(id),
      });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAppointment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: appointmentQueryKeys.list,
      });
    },
  });
}
