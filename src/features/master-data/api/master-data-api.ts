import { apiClient } from "@/lib/api/client";
import { fromApiRow, fromApiRows, toApiPayload } from "../mappers";
import type { MasterResource, MasterRow } from "../types";

const base = (resource: MasterResource) => `/master-data/${resource}`;

export async function listMasterData(resource: MasterResource): Promise<MasterRow[]> {
  const { data } = await apiClient.get<MasterRow[]>(base(resource));
  return fromApiRows(resource, data);
}

export async function createMasterData(
  resource: MasterResource,
  payload: Record<string, unknown>,
): Promise<MasterRow> {
  const { data } = await apiClient.post<MasterRow>(
    base(resource),
    toApiPayload(resource, payload),
  );
  return fromApiRow(resource, data);
}

export async function updateMasterData(
  resource: MasterResource,
  id: string,
  payload: Record<string, unknown>,
): Promise<MasterRow> {
  const { data } = await apiClient.patch<MasterRow>(
    `${base(resource)}/${id}`,
    toApiPayload(resource, payload),
  );
  return fromApiRow(resource, data);
}

export async function deleteMasterData(
  resource: MasterResource,
  id: string,
): Promise<void> {
  await apiClient.delete(`${base(resource)}/${id}`);
}

export async function setDepartmentIsActive(
  id: string,
  isActive: boolean,
): Promise<MasterRow> {
  const { data } = await apiClient.patch<MasterRow>(
    `${base("departments")}/${id}/is-active`,
    { isActive },
  );
  return data;
}
