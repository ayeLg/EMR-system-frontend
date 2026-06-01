"use client";

import { useRouter } from "next/navigation";
import type { TableProps } from "antd";
import { Tag } from "antd";
import { DataTable } from "@/components/common/DataTable";
import { ROUTES } from "@/config/routes";
import { useEncounters } from "../hooks/useEncounters";
import { ENC_STATUS_META } from "../constants";
import type { Encounter } from "../types";

export function EncounterTable() {
  const router = useRouter();
  const { data, isLoading } = useEncounters();

  const columns: TableProps<Encounter>["columns"] = [
    { title: "Encounter", dataIndex: "encounterNo", key: "encounterNo" },
    { title: "Patient", key: "patient", render: (_, r) => `${r.patientName} · ${r.mrn}` },
    { title: "Doctor", dataIndex: "doctorName", key: "doctor" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Start", dataIndex: "startTime", key: "startTime" },
    {
      title: "Status",
      key: "status",
      render: (_, r) => (
        <Tag color={ENC_STATUS_META[r.status].color}>
          {ENC_STATUS_META[r.status].label}
        </Tag>
      ),
    },
  ];

  return (
    <DataTable<Encounter>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={isLoading}
      onRow={(record) => ({
        onClick: () => router.push(`${ROUTES.encounters}/${record.id}`),
        style: { cursor: "pointer" },
      })}
    />
  );
}
