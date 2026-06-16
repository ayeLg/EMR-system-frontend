"use client";

import { useState } from "react";
import type { TableProps } from "antd";
import { App, Button, Flex, Input, Select, Table, Tag } from "antd";
import { useQuery } from "@tanstack/react-query";
import { DIAGNOSIS_TYPE_OPTIONS } from "../constants";
import { useAddEncounterDiagnosis } from "../hooks/useEncounters";
import { searchIcd10 } from "../api/icd10-api";
import type { Diagnosis } from "../types";

export function DiagnosesPanel({
  encounterId,
  initial,
  readOnly = false,
}: {
  encounterId: string;
  initial: Diagnosis[];
  readOnly?: boolean;
}) {
  const { message } = App.useApp();
  const addDiagnosis = useAddEncounterDiagnosis(encounterId);
  const [rows, setRows] = useState<Diagnosis[]>(initial);
  const [code, setCode] = useState<string>();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<Diagnosis["type"]>("PRIMARY");
  const [notes, setNotes] = useState("");

  // Server-side ICD-10 search against the catalog master table.
  const { data: icd10 = [], isFetching: searchingIcd10 } = useQuery({
    queryKey: ["icd10", search],
    queryFn: () => searchIcd10(search),
    staleTime: 60_000,
  });

  const add = async () => {
    const opt = icd10.find((o) => o.code === code);
    if (!opt) {
      message.warning("Select an ICD-10 code.");
      return;
    }
    if (rows.some((r) => r.icd10Code === opt.code)) {
      message.warning("Diagnosis already added.");
      return;
    }

    // description comes from the ICD-10 catalog entry, never hand-typed.
    const diagnosis: Diagnosis = {
      icd10Code: opt.code,
      description: opt.description,
      type,
      notes: notes.trim() || undefined,
    };
    try {
      await addDiagnosis.mutateAsync(diagnosis);
      setRows((prev) => [...prev, diagnosis]);
      setCode(undefined);
      setNotes("");
      message.success("Diagnosis added.");
    } catch (err) {
      const apiErr = err as { message?: string };
      message.error(apiErr.message ?? "Failed to add diagnosis");
    }
  };

  const columns: TableProps<Diagnosis>["columns"] = [
    {
      title: "ICD-10",
      dataIndex: "icd10Code",
      key: "icd10Code",
      render: (v) => <Tag>{v}</Tag>,
    },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (v?: string) => v || <span style={{ opacity: 0.45 }}>—</span>,
    },
  ];

  return (
    <Flex vertical gap={12}>
      {readOnly ? null : (
      <Flex gap={8} wrap="wrap">
        <Select
          showSearch
          placeholder="Search ICD-10 (code or name)"
          style={{ minWidth: 320 }}
          value={code}
          onChange={setCode}
          onSearch={setSearch}
          filterOption={false}
          loading={searchingIcd10}
          notFoundContent={searchingIcd10 ? "Searching…" : "No matches"}
          options={icd10.map((c) => ({
            value: c.code,
            label: `${c.code} - ${c.description}`,
          }))}
        />
        <Select
          style={{ width: 160 }}
          options={DIAGNOSIS_TYPE_OPTIONS}
          value={type}
          onChange={(v) => setType(v as Diagnosis["type"])}
        />
        <Input
          placeholder="Notes (optional)"
          style={{ flex: 1, minWidth: 200 }}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          allowClear
        />
        <Button type="primary" onClick={add} loading={addDiagnosis.isPending}>
          Add diagnosis
        </Button>
      </Flex>
      )}
      <Table<Diagnosis>
        rowKey="icd10Code"
        size="small"
        bordered
        columns={columns}
        dataSource={rows}
        pagination={false}
      />
    </Flex>
  );
}
