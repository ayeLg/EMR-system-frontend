"use client";

import { useQuery } from "@tanstack/react-query";
import { getStaff } from "../api/users-api";

export function useStaff() {
  return useQuery({ queryKey: ["staff"], queryFn: getStaff });
}
