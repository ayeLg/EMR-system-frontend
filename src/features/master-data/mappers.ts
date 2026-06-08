import type { MasterResource, MasterRow } from "./types";

/** Map UI medication `form` to API `dosageForm`. */
export function toApiPayload(
  resource: MasterResource,
  values: Record<string, unknown>,
): Record<string, unknown> {
  if (resource !== "medications") return values;

  const { form, ...rest } = values;
  return {
    ...rest,
    ...(form !== undefined && form !== "" ? { dosageForm: form } : {}),
  };
}

/** Map API medication `dosageForm` to UI `form`. */
export function fromApiRow(resource: MasterResource, row: MasterRow): MasterRow {
  if (resource !== "medications") return row;

  const { dosageForm, ...rest } = row as MasterRow & { dosageForm?: string };
  return {
    ...rest,
    form: (row.form as string | undefined) ?? dosageForm ?? "",
  };
}

export function fromApiRows(resource: MasterResource, rows: MasterRow[]): MasterRow[] {
  return rows.map((row) => fromApiRow(resource, row));
}
