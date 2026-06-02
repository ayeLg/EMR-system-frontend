"use client";

import type { TableProps } from "antd";
import { Tag } from "antd";
import dayjs from "dayjs";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { useInventory } from "../hooks/usePharmacy";
import type { InventoryItem } from "../types";

const TODAY = dayjs("2026-05-31");

export function InventoryTable() {
  const { data, isLoading } = useInventory();

  const columns: TableProps<InventoryItem>["columns"] = [
    { title: "Medication", dataIndex: "name", key: "name" },
    { title: "Batch", dataIndex: "batchNumber", key: "batchNumber" },
    {
      title: "Expiry",
      key: "expiryDate",
      render: (_, r) => {
        const days = dayjs(r.expiryDate).diff(TODAY, "day");
        const near = days <= 30;
        return (
          <span>
            {r.expiryDate}{" "}
            {near ? <Tag color="orange">{days}d</Tag> : null}
          </span>
        );
      },
    },
    {
      title: "On hand",
      key: "quantityOnHand",
      render: (_, r) => {
        const low = r.quantityOnHand <= r.reorderLevel;
        return (
          <span>
            {r.quantityOnHand}{" "}
            {low ? <Tag color="red">Low</Tag> : null}
          </span>
        );
      },
    },
    { title: "Reorder level", dataIndex: "reorderLevel", key: "reorderLevel" },
  ];

  return (
    <ContentCard>
      <DataTable<InventoryItem>
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={isLoading}
      />
    </ContentCard>
  );
}
