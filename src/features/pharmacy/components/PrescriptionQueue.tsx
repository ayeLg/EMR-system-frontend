"use client";

import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import { Button, Tag } from "antd";
import { DataTable } from "@/components/common/DataTable";
import { usePrescriptions } from "../hooks/usePharmacy";
import { PRIORITY_META, RX_STATUS_META } from "../constants";
import type { Prescription } from "../types";
import { DispenseModal } from "./DispenseModal";

export function PrescriptionQueue() {
  const { data, isLoading } = usePrescriptions();
  const [selected, setSelected] = useState<Prescription | null>(null);
  const [dispensedIds, setDispensedIds] = useState<string[]>([]);

  // STAT first, then by time.
  const rows = useMemo(() => {
    const order: Record<string, number> = { STAT: 0, URGENT: 1, ROUTINE: 2 };
    return [...(data ?? [])].sort(
      (a, b) => order[a.priority] - order[b.priority],
    );
  }, [data]);

  const columns: TableProps<Prescription>["columns"] = [
    { title: "Rx No.", dataIndex: "rxNumber", key: "rxNumber" },
    { title: "Patient", key: "patient", render: (_, r) => `${r.patientName} · ${r.mrn}` },
    { title: "Prescriber", dataIndex: "prescribedBy", key: "prescribedBy" },
    { title: "Time", dataIndex: "prescribedAt", key: "prescribedAt" },
    {
      title: "Priority",
      key: "priority",
      render: (_, r) => (
        <Tag color={PRIORITY_META[r.priority].color}>
          {PRIORITY_META[r.priority].label}
        </Tag>
      ),
    },
    { title: "Items", key: "items", render: (_, r) => r.items.length },
    {
      title: "Status",
      key: "status",
      render: (_, r) => {
        const status = dispensedIds.includes(r.id) ? "DISPENSED" : r.status;
        return <Tag color={RX_STATUS_META[status].color}>{RX_STATUS_META[status].label}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, r) =>
        dispensedIds.includes(r.id) ? null : (
          <Button size="small" type="primary" onClick={() => setSelected(r)}>
            Dispense
          </Button>
        ),
    },
  ];

  return (
    <>
      <DataTable<Prescription>
        rowKey="id"
        columns={columns}
        dataSource={rows}
        loading={isLoading}
      />
      <DispenseModal
        rx={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onDispensed={(id) => {
          setDispensedIds((p) => [...p, id]);
          setSelected(null);
        }}
      />
    </>
  );
}
