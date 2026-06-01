"use client";

import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import { Flex, Select, Tag } from "antd";
import { DataTable } from "@/components/common/DataTable";
import { useAppointments } from "../hooks/useAppointments";
import {
  APPT_STATUS_META,
  APPT_TYPE_LABEL,
  STATUS_FILTER_OPTIONS,
} from "../constants";
import type { Appointment } from "../types";

export function AppointmentTable() {
  const { data, isLoading } = useAppointments();
  const [status, setStatus] = useState<string | undefined>();

  const filtered = useMemo(
    () => (data ?? []).filter((a) => !status || a.status === status),
    [data, status],
  );

  const columns: TableProps<Appointment>["columns"] = [
    { title: "No.", dataIndex: "appointmentNo", key: "appointmentNo" },
    {
      title: "Patient",
      key: "patient",
      render: (_, r) => `${r.patientName} · ${r.mrn}`,
    },
    { title: "Doctor", dataIndex: "doctorName", key: "doctor" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Scheduled", dataIndex: "scheduledAt", key: "scheduledAt" },
    {
      title: "Type",
      key: "type",
      render: (_, r) => APPT_TYPE_LABEL[r.type],
    },
    {
      title: "Status",
      key: "status",
      render: (_, r) => (
        <Tag color={APPT_STATUS_META[r.status].color}>
          {APPT_STATUS_META[r.status].label}
        </Tag>
      ),
    },
  ];

  return (
    <Flex vertical gap={12}>
      <Select
        placeholder="Filter status"
        allowClear
        value={status}
        onChange={setStatus}
        style={{ width: 180 }}
        options={STATUS_FILTER_OPTIONS}
      />
      <DataTable<Appointment>
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        loading={isLoading}
      />
    </Flex>
  );
}
