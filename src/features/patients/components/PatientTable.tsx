"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { TableProps } from "antd";
import { Flex, Input, Select } from "antd";
import { useTranslations } from "next-intl";
import { DataTable } from "@/components/common/DataTable";
import { StatusTag } from "@/components/ui/StatusTag";
import { GENDER, PATIENT_STATUS } from "@/config/enums";
import { ROUTES } from "@/config/routes";
import { usePatients } from "../hooks/usePatients";
import type { Patient } from "../types";

export function PatientTable() {
  const t = useTranslations();
  const tp = useTranslations("patients");
  const router = useRouter();
  const { data, isLoading } = usePatients();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>();

  const filtered = useMemo(() => {
    const rows = data ?? [];
    const q = search.trim().toLowerCase();
    return rows.filter((p) => {
      const matchQ =
        !q ||
        p.fullName.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.primaryPhone.toLowerCase().includes(q);
      const matchStatus = !status || p.status === status;
      return matchQ && matchStatus;
    });
  }, [data, search, status]);

  const columns: TableProps<Patient>["columns"] = [
    { title: tp("name"), key: "name", render: (_, r) => `${r.fullName} · ${r.mrn}` },
    { title: tp("phone"), dataIndex: "primaryPhone", key: "phone" },
    { title: tp("gender"), key: "gender", render: (_, r) => t(GENDER[r.gender].labelKey) },
    {
      title: tp("status"),
      key: "status",
      render: (_, r) => (
        <StatusTag
          labelKey={PATIENT_STATUS[r.status].labelKey}
          color={PATIENT_STATUS[r.status].color}
        />
      ),
    },
  ];

  return (
    <Flex vertical gap={12}>
      <Flex gap={8} wrap="wrap">
        <Input.Search
          placeholder={t("common.search")}
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <Select
          placeholder={tp("status")}
          allowClear
          value={status}
          onChange={setStatus}
          style={{ width: 160 }}
          options={[
            { label: t("status.active"), value: "ACTIVE" },
            { label: t("status.inactive"), value: "INACTIVE" },
          ]}
        />
      </Flex>
      <DataTable<Patient>
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        loading={isLoading}
        onRow={(record) => ({
          onClick: () => router.push(`${ROUTES.patients}/${record.id}`),
          style: { cursor: "pointer" },
        })}
      />
    </Flex>
  );
}
