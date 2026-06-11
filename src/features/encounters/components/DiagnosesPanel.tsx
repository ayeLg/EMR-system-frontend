"use client";

import { useState } from "react";
import type { TableProps } from "antd";
import { App, Button, Flex, Select, Table, Tag } from "antd";
import { DIAGNOSIS_TYPE_OPTIONS, ICD10_OPTIONS } from "../constants";
import { useAddEncounterDiagnosis } from "../hooks/useEncounters";
import type { Diagnosis } from "../types";

export function DiagnosesPanel({
  encounterId,
  initial,
}: {
  encounterId: string;
  initial: Diagnosis[];
}) {
  const { message } = App.useApp();
  const addDiagnosis = useAddEncounterDiagnosis(encounterId);
  const [rows, setRows] = useState<Diagnosis[]>(initial);
  const [code, setCode] = useState<string>();
  const [type, setType] = useState<Diagnosis["type"]>("PRIMARY");

  const add = async () => {
    const opt = ICD10_OPTIONS.find((o) => o.value === code);
    if (!opt) {
      message.warning("Select an ICD-10 code.");
      return;
    }
    if (rows.some((r) => r.icd10Code === opt.value)) {
      message.warning("Diagnosis already added.");
      return;
    }

    const diagnosis = {
      icd10Code: opt.value,
      description: opt.label.split(" - ")[1] ?? opt.label,
      type,
    };
    await addDiagnosis.mutateAsync(diagnosis);
    setRows((prev) => [...prev, diagnosis]);
    setCode(undefined);
    message.success("Diagnosis added.");
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
  ];

  return (
    <Flex vertical gap={12}>
      <Flex gap={8} wrap="wrap">
        <Select
          showSearch
          placeholder="Search ICD-10"
          style={{ minWidth: 280 }}
          options={ICD10_OPTIONS}
          value={code}
          onChange={setCode}
          optionFilterProp="label"
        />
        <Select
          style={{ width: 160 }}
          options={DIAGNOSIS_TYPE_OPTIONS}
          value={type}
          onChange={(v) => setType(v as Diagnosis["type"])}
        />
        <Button type="primary" onClick={add} loading={addDiagnosis.isPending}>
          Add diagnosis
        </Button>
      </Flex>
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
