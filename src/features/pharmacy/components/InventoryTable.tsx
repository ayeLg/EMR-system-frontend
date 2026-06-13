"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { TableProps } from "antd";
import { App, Button, Popconfirm, Space, Tag } from "antd";
import dayjs from "dayjs";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { deleteInventory } from "../api/pharmacy-api";
import { useInventory } from "../hooks/usePharmacy";
import type { InventoryItem } from "../types";
import { InventoryModal } from "./InventoryModal";

const TODAY = dayjs("2026-05-31");

export function InventoryTable() {
  const { data, isLoading } = useInventory();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const queryClient = useQueryClient();
  const { message } = App.useApp();

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
            {r.expiryDate} {near ? <Tag color="orange">{days}d</Tag> : null}
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
            {r.quantityOnHand} {low ? <Tag color="red">Low</Tag> : null}
          </span>
        );
      },
    },
    { title: "Reorder level", dataIndex: "reorderLevel", key: "reorderLevel" },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) => (
        <Space size="middle">
          <Button
            size="small"
            type="link"
            onClick={() => {
              setSelectedItem(r);
              setModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this batch?"
            okText="Yes"
            cancelText="No"
            onConfirm={async () => {
              try {
                await deleteInventory(r.id);
                message.success("Inventory batch deleted.");
                queryClient.invalidateQueries({ queryKey: ["inventory"] });
              } catch (err: unknown) {
                const apiErr = err as { message?: string };
                message.error(apiErr.message || "Failed to delete item");
              }
            }}
          >
            <Button size="small" type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          onClick={() => {
            setSelectedItem(null);
            setModalOpen(true);
          }}
        >
          Receive Stock (Add Batch)
        </Button>
      </div>
      <ContentCard>
        <DataTable<InventoryItem>
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={isLoading}
        />
      </ContentCard>
      <InventoryModal
        open={modalOpen}
        item={selectedItem}
        onClose={() => setModalOpen(false)}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ["inventory"] })}
      />
    </>
  );
}
