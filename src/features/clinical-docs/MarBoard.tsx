"use client";

import { useState } from "react";
import type { TableProps } from "antd";
import { App, Button, Tag } from "antd";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";

interface MarRow {
  id: string;
  medication: string;
  dose: string;
  route: string;
}

const SLOTS = ["08:00", "14:00", "20:00"] as const;

const MED_ROWS: MarRow[] = [
  { id: "1", medication: "Amlodipine", dose: "5mg", route: "ORAL" },
  { id: "2", medication: "Metformin", dose: "500mg", route: "ORAL" },
  { id: "3", medication: "Ceftriaxone", dose: "1g", route: "IV" },
];

export function MarBoard() {
  const { message } = App.useApp();
  // key = `${rowId}-${slot}` → administered
  const [given, setGiven] = useState<Record<string, boolean>>({ "1-08:00": true });

  const administer = (rowId: string, slot: string, med: string) => {
    setGiven((p) => ({ ...p, [`${rowId}-${slot}`]: true }));
    message.success(`${med} administered at ${slot} (mock). Signed off + timestamped.`);
  };

  const slotCols = SLOTS.map((slot) => ({
    title: slot,
    key: slot,
    render: (_: unknown, r: MarRow) =>
      given[`${r.id}-${slot}`] ? (
        <Tag color="green">✓ Given</Tag>
      ) : (
        <Button size="small" onClick={() => administer(r.id, slot, r.medication)}>
          Administer
        </Button>
      ),
  }));

  const columns: TableProps<MarRow>["columns"] = [
    { title: "Medication", dataIndex: "medication", key: "medication" },
    { title: "Dose", dataIndex: "dose", key: "dose" },
    { title: "Route", dataIndex: "route", key: "route" },
    ...slotCols,
  ];

  return (
    <ContentCard>
      <DataTable<MarRow> rowKey="id" columns={columns} dataSource={MED_ROWS} />
    </ContentCard>
  );
}
