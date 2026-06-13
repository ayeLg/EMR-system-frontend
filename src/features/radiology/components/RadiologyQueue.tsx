"use client";

import { useRouter } from "next/navigation";
import type { TableProps } from "antd";
import { Tag } from "antd";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { ROUTES } from "@/config/routes";
import { useRadiologyOrders } from "../hooks/useRadiology";
import { RADIOLOGY_PRIORITY_META, RADIOLOGY_STATUS_META } from "../constants";
import type { RadiologyOrder } from "../types";

export function RadiologyQueue() {
  const router = useRouter();
  const { data, isLoading } = useRadiologyOrders();

  const columns: TableProps<RadiologyOrder>["columns"] = [
    { title: "Order No.", key: "id", render: (_, r) => r.id.substring(0, 8).toUpperCase() },
    { title: "Patient", key: "patient", render: (_, r) => `${r.patientName} · ${r.mrn}` },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Ordered by", dataIndex: "orderedBy", key: "orderedBy" },
    {
      title: "Time",
      key: "orderedAt",
      render: (_, r) => new Date(r.orderedAt).toLocaleString(),
    },
    {
      title: "Priority",
      key: "priority",
      render: (_, r) => (
        <Tag color={RADIOLOGY_PRIORITY_META[r.priority].color}>
          {RADIOLOGY_PRIORITY_META[r.priority].label}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, r) => (
        <Tag color={RADIOLOGY_STATUS_META[r.status].color}>
          {RADIOLOGY_STATUS_META[r.status].label}
        </Tag>
      ),
    },
  ];

  return (
    <ContentCard>
      <DataTable<RadiologyOrder>
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={isLoading}
        onRow={(record) => ({
          onClick: () => router.push(`${ROUTES.radiology}/${record.id}`),
          style: { cursor: "pointer" },
        })}
      />
    </ContentCard>
  );
}
