"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMasterData,
  deleteMasterData,
  listMasterData,
  setDepartmentIsActive,
  updateMasterData,
} from "../api/master-data-api";
import type { MasterResource } from "../types";

export const masterDataQueryKey = (resource: MasterResource) =>
  ["master-data", resource] as const;

export function useMasterData(resource: MasterResource) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: masterDataQueryKey(resource),
    queryFn: () => listMasterData(resource),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      createMasterData(resource, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: masterDataQueryKey(resource) });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, unknown>;
    }) => updateMasterData(resource, id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: masterDataQueryKey(resource) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMasterData(resource, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: masterDataQueryKey(resource) });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (resource !== "departments") {
        return Promise.reject(new Error("Active toggle is only supported for departments"));
      }
      return setDepartmentIsActive(id, isActive);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: masterDataQueryKey(resource) });
    },
  });

  return {
    rows: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,
    toggleActive: toggleActiveMutation,
  };
}
