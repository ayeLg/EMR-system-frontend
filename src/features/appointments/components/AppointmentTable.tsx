"use client";

import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import { Tag } from "antd";
import { useTranslations } from "next-intl";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { SearchInput } from "@/components/ui/SearchInput";
import { useAppointments } from "../hooks/useAppointments";
import {
  APPT_STATUS_META,
  APPT_TYPE_LABEL,
  STATUS_FILTER_OPTIONS,
} from "../constants";
import type { Appointment } from "../types";

export function AppointmentTable() {
  const t = useTranslations("common");
  const { data, isLoading } = useAppointments();
  const [status, setStatus] = useState<string | undefined>();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data ?? []).filter((a) => {
      const matchStatus = !status || a.status === status;
      const matchQ =
        !q ||
        a.appointmentNo.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.mrn.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q);
      return matchStatus && matchQ;
    });
  }, [data, status, search]);

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
    <ContentCard
      toolbar={
        <PageToolbar
          search={
            <SearchInput
              wide
              placeholder={t("searchAppointments")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          }
          filters={
            <FilterSelect
              label={t("filterStatus")}
              placeholder={t("filterStatus")}
              value={status}
              onChange={setStatus}
              options={STATUS_FILTER_OPTIONS}
              style={{ minWidth: 200 }}
            />
          }
        />
      }
    >
      <DataTable<Appointment>
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        loading={isLoading}
      />
    </ContentCard>
  );
}
