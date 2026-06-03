"use client";

import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import { Tag } from "antd";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { SearchInput } from "@/components/ui/SearchInput";

interface AuditEntry {
  id: string;
  time: string;
  user: string;
  action: string;
  module: string;
  resource: string;
  ip: string;
}

const ACTION_COLOR: Record<string, string> = {
  READ: "blue",
  CREATE: "green",
  UPDATE: "gold",
  DELETE: "red",
  LOGIN: "purple",
  OVERRIDE: "volcano",
};

const MOCK_AUDIT: AuditEntry[] = [
  { id: "1", time: "2026-05-31 09:21", user: "Dr. Aung Aung", action: "READ", module: "Patient", resource: "MRN-0100043", ip: "10.0.0.5" },
  { id: "2", time: "2026-05-31 09:22", user: "Dr. Aung Aung", action: "CREATE", module: "Prescription", resource: "RX-0300009", ip: "10.0.0.5" },
  { id: "3", time: "2026-05-31 09:25", user: "Dr. Aung Aung", action: "OVERRIDE", module: "Allergy", resource: "Penicillin override", ip: "10.0.0.5" },
  { id: "4", time: "2026-05-31 09:40", user: "Su Su (Reception)", action: "CREATE", module: "Appointment", resource: "APT-0600016", ip: "10.0.0.9" },
  { id: "5", time: "2026-05-31 10:05", user: "Ko Zaw (Pharmacy)", action: "UPDATE", module: "Inventory", resource: "Warfarin batch B-2350", ip: "10.0.0.12" },
  { id: "6", time: "2026-05-31 08:00", user: "system", action: "LOGIN", module: "Auth", resource: "Dr. Hla Hla login", ip: "10.0.0.7" },
];

export function AuditTable() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_AUDIT.filter(
      (e) =>
        !q ||
        e.user.toLowerCase().includes(q) ||
        e.module.toLowerCase().includes(q) ||
        e.resource.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q),
    );
  }, [search]);

  const columns: TableProps<AuditEntry>["columns"] = [
    { title: "Timestamp", dataIndex: "time", key: "time" },
    { title: "User", dataIndex: "user", key: "user" },
    {
      title: "Action",
      key: "action",
      render: (_, r) => <Tag color={ACTION_COLOR[r.action] ?? "default"}>{r.action}</Tag>,
    },
    { title: "Module", dataIndex: "module", key: "module" },
    { title: "Resource", dataIndex: "resource", key: "resource" },
    { title: "IP", dataIndex: "ip", key: "ip" },
  ];

  return (
    <ContentCard
      toolbar={
        <PageToolbar
          search={
            <SearchInput
              wide
              placeholder="Search user, module, action…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          }
        />
      }
    >
      <DataTable<AuditEntry> rowKey="id" columns={columns} dataSource={filtered} />
    </ContentCard>
  );
}
