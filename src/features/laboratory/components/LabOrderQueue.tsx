"use client";

import { useRouter } from "next/navigation";
import type { TableProps } from "antd";
import { Tag } from "antd";
import { DataTable } from "@/components/common/DataTable";
import { ROUTES } from "@/config/routes";
import { useLabOrders } from "../hooks/useLaboratory";
import { LAB_PRIORITY_META, LAB_STATUS_META } from "../constants";
import type { LabOrder } from "../types";

export function LabOrderQueue() {
  const router = useRouter();
  const { data, isLoading } = useLabOrders();

  const columns: TableProps<LabOrder>["columns"] = [
    { title: "Order No.", dataIndex: "orderNo", key: "orderNo" },
    { title: "Patient", key: "patient", render: (_, r) => `${r.patientName} · ${r.mrn}` },
    { title: "Ordered by", dataIndex: "orderedBy", key: "orderedBy" },
    { title: "Time", dataIndex: "orderedAt", key: "orderedAt" },
    {
      title: "Priority",
      key: "priority",
      render: (_, r) => (
        <Tag color={LAB_PRIORITY_META[r.priority].color}>
          {LAB_PRIORITY_META[r.priority].label}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, r) => (
        <Tag color={LAB_STATUS_META[r.status].color}>
          {LAB_STATUS_META[r.status].label}
        </Tag>
      ),
    },
  ];

  return (
    <DataTable<LabOrder>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={isLoading}
      onRow={(record) => ({
        onClick: () => router.push(`${ROUTES.laboratory}/${record.id}`),
        style: { cursor: "pointer" },
      })}
    />
  );
}
