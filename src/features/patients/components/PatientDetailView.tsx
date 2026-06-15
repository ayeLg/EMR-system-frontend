"use client";

import { useState } from "react";
import type { TableProps } from "antd";
import { Button, Descriptions, Skeleton, Space, Tabs, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { AllergyFormModal } from "./AllergyFormModal";
import { ROUTES } from "@/config/routes";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusTag } from "@/components/ui/StatusTag";
import { DataTable } from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { getPatientStatusMeta } from "@/config/enums";
import { BLOOD_TYPE_OPTIONS, GENDER_OPTIONS } from "../options";
import { usePatient } from "../hooks/usePatient";
import type { EncounterSummary, PatientAllergy } from "../types";

const SEVERITY_COLOR: Record<PatientAllergy["severity"], string> = {
  MILD: "green",
  MODERATE: "orange",
  SEVERE: "red",
  FATAL: "red",
};

function label(options: { label: string; value: string }[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function PatientDetailView({ id }: { id: string }) {
  const { data, isLoading } = usePatient(id);
  const [allergyModalOpen, setAllergyModalOpen] = useState(false);

  if (isLoading) return <Skeleton active paragraph={{ rows: 8 }} />;
  if (!data) return <EmptyState description="Patient not found" />;

  const statusMeta = getPatientStatusMeta(data.status);

  const allergyColumns: TableProps<PatientAllergy>["columns"] = [
    { title: "Allergen", dataIndex: "allergenName", key: "allergenName" },
    { title: "Type", dataIndex: "allergenType", key: "allergenType" },
    {
      title: "Severity",
      key: "severity",
      render: (_, r) => <Tag color={SEVERITY_COLOR[r.severity]}>{r.severity}</Tag>,
    },
    { title: "Reaction", dataIndex: "reaction", key: "reaction" },
  ];

  const encounterColumns: TableProps<EncounterSummary>["columns"] = [
    { title: "Encounter", dataIndex: "encounterNo", key: "encounterNo" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Doctor", dataIndex: "doctor", key: "doctor" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <>
      <PageHeader
        title={data.fullName}
        subtitle={data.mrn}
        actions={
          <Space>
            {statusMeta ? (
              <StatusTag labelKey={statusMeta.labelKey} color={statusMeta.color} />
            ) : null}
            <Button icon={<EditOutlined />} href={`${ROUTES.patients}/${id}/edit`}>
              Edit
            </Button>
          </Space>
        }
      />
      <Tabs
        items={[
          {
            key: "demographics",
            label: "Demographics",
            children: (
              <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
                <Descriptions.Item label="MRN">{data.mrn}</Descriptions.Item>
                <Descriptions.Item label="Date of birth">{data.dateOfBirth}</Descriptions.Item>
                <Descriptions.Item label="Gender">
                  {data.gender ? label(GENDER_OPTIONS, data.gender) : "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Blood type">{label(BLOOD_TYPE_OPTIONS, data.bloodType)}</Descriptions.Item>
                <Descriptions.Item label="NRC">{data.nrcNumber ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="Phone">{data.primaryPhone}</Descriptions.Item>
                <Descriptions.Item label="Email">{data.email ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="City">{data.city ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="Township">{data.township ?? "—"}</Descriptions.Item>
                <Descriptions.Item label="Address">{data.address ?? "—"}</Descriptions.Item>
              </Descriptions>
            ),
          },
          {
            key: "allergies",
            label: `Allergies (${data.allergies.length})`,
            children: (
              <Space direction="vertical" style={{ width: "100%" }} size={16}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button type="primary" onClick={() => setAllergyModalOpen(true)}>
                    Add Allergy
                  </Button>
                </div>
                <DataTable<PatientAllergy>
                  rowKey="id"
                  columns={allergyColumns}
                  dataSource={data.allergies}
                />
                <AllergyFormModal
                  patientId={id}
                  open={allergyModalOpen}
                  onCancel={() => setAllergyModalOpen(false)}
                />
              </Space>
            ),
          },
          {
            key: "encounters",
            label: `Encounters (${data.recentEncounters.length})`,
            children: (
              <DataTable<EncounterSummary>
                rowKey="id"
                columns={encounterColumns}
                dataSource={data.recentEncounters}
              />
            ),
          },
        ]}
      />
    </>
  );
}
