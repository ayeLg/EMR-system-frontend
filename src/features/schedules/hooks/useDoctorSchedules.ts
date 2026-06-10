"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDoctorSchedule,
  deleteDoctorSchedule,
  listDoctorSchedules,
  setDoctorScheduleActive,
  updateDoctorSchedule,
} from "../api/doctor-schedules-api";
import type { DoctorSchedulePayload } from "../types";

export const doctorSchedulesQueryKey = ["doctor-schedules"] as const;

export function useDoctorSchedules(filters?: {
  doctorId?: string;
  dayOfWeek?: number;
}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...doctorSchedulesQueryKey, filters ?? {}],
    queryFn: () => listDoctorSchedules(filters),
  });

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: doctorSchedulesQueryKey });

  const create = useMutation({
    mutationFn: (payload: DoctorSchedulePayload) => createDoctorSchedule(payload),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<DoctorSchedulePayload> }) =>
      updateDoctorSchedule(id, payload),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteDoctorSchedule(id),
    onSuccess: invalidate,
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      setDoctorScheduleActive(id, isActive),
    onSuccess: invalidate,
  });

  return {
    rows: query.data ?? [],
    isLoading: query.isLoading,
    create,
    update,
    remove,
    toggleActive,
  };
}
