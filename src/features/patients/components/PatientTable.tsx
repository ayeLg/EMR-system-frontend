"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { TableProps } from "antd";
import { useTranslations } from "next-intl";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { SearchInput } from "@/components/ui/SearchInput";
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
    <ContentCard
      toolbar={
        <PageToolbar
          search={
            <SearchInput
              wide
              placeholder={t("common.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          }
          filters={
            <FilterSelect
              label={tp("status")}
              placeholder={t("common.filterStatus")}
              value={status}
              onChange={setStatus}
              options={[
                { label: t("status.active"), value: "ACTIVE" },
                { label: t("status.inactive"), value: "INACTIVE" },
              ]}
            />
          }
        />
      }
    >
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
    </ContentCard>
  );
}
