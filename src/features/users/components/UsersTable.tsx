"use client";

import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import { Tag } from "antd";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { SearchInput } from "@/components/ui/SearchInput";
import { useStaff } from "../hooks/useStaff";
import type { StaffStatus, StaffUser } from "../types";
import { AddUserModal } from "./AddUserModal";

const STATUS_COLOR: Record<StaffStatus, string> = {
  ACTIVE: "green",
  INACTIVE: "default",
  SUSPENDED: "red",
  PENDING: "gold",
};

interface UsersTableProps {
  modalOpen: boolean;
  onCloseModal: () => void;
}

export function UsersTable({ modalOpen, onCloseModal }: UsersTableProps) {
  const { data, isLoading } = useStaff();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter(
      (u) =>
        !q ||
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.employeeId.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q),
    );
  }, [data, search]);

  const columns: TableProps<StaffUser>["columns"] = [
    { title: "Name", dataIndex: "fullName", key: "fullName" },
    { title: "Employee ID", dataIndex: "employeeId", key: "employeeId" },
    { title: "Role", key: "role", render: (_, r) => <Tag>{r.role}</Tag> },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Status",
      key: "status",
      render: (_, r) => <Tag color={STATUS_COLOR[r.status]}>{r.status}</Tag>,
    },
  ];

  return (
    <>
      <ContentCard
        toolbar={
          <PageToolbar
            search={
              <SearchInput
                wide
                placeholder="Search by name, email, or ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        }
      >
        <DataTable<StaffUser>
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          loading={isLoading}
        />
      </ContentCard>
      <AddUserModal open={modalOpen} onClose={onCloseModal} />
    </>
  );
}
