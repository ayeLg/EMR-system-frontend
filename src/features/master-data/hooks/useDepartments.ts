"use client";

import { useQuery } from "@tanstack/react-query";
import { listMasterData } from "../api/master-data-api";
import { masterDataQueryKey } from "./useMasterData";

/** Department options for ward forms and other selects. */
export function useDepartments() {
  return useQuery({
    queryKey: masterDataQueryKey("departments"),
    queryFn: () => listMasterData("departments"),
    staleTime: 60_000,
  });
}
