"use client";

import { useState } from "react";
import type { TableProps } from "antd";
import { Button, Flex, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DataTable } from "@/components/common/DataTable";
import { useStaff } from "../hooks/useStaff";
import type { StaffStatus, StaffUser } from "../types";
import { AddUserModal } from "./AddUserModal";

const STATUS_COLOR: Record<StaffStatus, string> = {
  ACTIVE: "green",
  INACTIVE: "default",
  SUSPENDED: "red",
  PENDING: "gold",
};

export function UsersTable() {
  const { data, isLoading } = useStaff();
  const [open, setOpen] = useState(false);

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
    <Flex vertical gap={12}>
      <Flex justify="flex-end">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add user
        </Button>
      </Flex>
      <DataTable<StaffUser>
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={isLoading}
      />
      <AddUserModal open={open} onClose={() => setOpen(false)} />
    </Flex>
  );
}
