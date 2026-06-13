"use client";

import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import { Button, Tag } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { usePrescriptions } from "../hooks/usePharmacy";
import { PRIORITY_META, RX_STATUS_META } from "../constants";
import type { Prescription } from "../types";
import { DispenseModal } from "./DispenseModal";

export function PrescriptionQueue() {
  const { data, isLoading } = usePrescriptions();
  const [selected, setSelected] = useState<Prescription | null>(null);
  const queryClient = useQueryClient();

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
        return <Tag color={RX_STATUS_META[r.status].color}>{RX_STATUS_META[r.status].label}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, r) =>
        r.status === "DISPENSED" || r.status === "CANCELLED" || r.status === "EXPIRED" ? null : (
          <Button size="small" type="primary" onClick={() => setSelected(r)}>
            Dispense
          </Button>
        ),
    },
  ];

  return (
    <>
      <ContentCard>
        <DataTable<Prescription>
          rowKey="id"
          columns={columns}
          dataSource={rows}
          loading={isLoading}
        />
      </ContentCard>
      <DispenseModal
        rx={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onDispensed={() => {
          queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
          queryClient.invalidateQueries({ queryKey: ["inventory"] });
          setSelected(null);
        }}
      />
    </>
  );
}
