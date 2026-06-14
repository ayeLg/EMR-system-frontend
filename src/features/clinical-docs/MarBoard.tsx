"use client";

import { useState } from "react";
import type { TableProps } from "antd";
import { App, Button, Flex, Select, Spin, Tag, Typography } from "antd";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { useInpatients } from "@/features/ipd/hooks/useIpd";
import { useMarDetails, useAdministerMedication } from "./hooks/useClinicalDocs";
import type { MarItem } from "./api/clinical-docs-api";

const { Text } = Typography;

const SLOTS = ["08:00", "14:00", "20:00"] as const;

export function MarBoard() {
  const { message } = App.useApp();
  const [selectedEncounterId, setSelectedEncounterId] = useState<string>("");

  // Get admitted inpatients list
  const { data: inpatients = [], isLoading: loadingInpatients } = useInpatients();

  // Find the selected inpatient record
  const selectedInpatient = inpatients.find((ip) => ip.id === selectedEncounterId);
  const patientId = selectedInpatient?.patientId || "";

  // Get MAR details for today for the selected patient
  const todayStr = new Date().toISOString().split("T")[0];
  const { data: marItems = [], isLoading: loadingMar } = useMarDetails(patientId, todayStr);

  // Administer mutation
  const administerMutation = useAdministerMedication(patientId, todayStr);

  const administer = (item: MarItem, slot: typeof SLOTS[number]) => {
    if (!selectedEncounterId) return;
    
    administerMutation.mutate(
      {
        encounterId: selectedEncounterId,
        prescriptionItemId: item.id,
        medicationName: item.medication,
        slot,
        adminDate: todayStr,
      },
      {
        onSuccess: () => {
          message.success(`${item.medication} administered at ${slot}. Signed off + timestamped.`);
        },
        onError: (err: unknown) => {
          const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
          const errMsg = errorObj?.response?.data?.message || errorObj?.message || "Failed to record administration";
          message.error(errMsg);
        },
      },
    );
  };

  const slotCols = SLOTS.map((slot) => ({
    title: slot,
    key: slot,
    render: (_: unknown, r: MarItem) => {
      const isGiven = r.given[slot];
      return isGiven ? (
        <Tag color="green">✓ Given</Tag>
      ) : (
        <Button
          size="small"
          loading={administerMutation.isPending}
          onClick={() => administer(r, slot)}
        >
          Administer
        </Button>
      );
    },
  }));

  const columns: TableProps<MarItem>["columns"] = [
    { title: "Medication", dataIndex: "medication", key: "medication" },
    { title: "Dose", dataIndex: "dose", key: "dose" },
    { title: "Route", dataIndex: "route", key: "route" },
    { title: "Frequency", dataIndex: "frequency", key: "frequency" },
    ...slotCols,
  ];

  // Render content conditionally to avoid nested ternaries and negated conditions
  let boardContent;
  if (selectedEncounterId) {
    if (loadingMar) {
      boardContent = (
        <Flex justify="center" style={{ padding: "40px 0" }}>
          <Spin size="large" />
        </Flex>
      );
    } else {
      boardContent = (
        <DataTable<MarItem>
          rowKey="id"
          columns={columns}
          dataSource={marItems}
          locale={{ emptyText: "No active prescription medications found for this patient." }}
        />
      );
    }
  } else {
    boardContent = (
      <Flex justify="center" style={{ padding: "40px 0" }}>
        <Text type="secondary">
          Please select an admitted patient to view and manage their Medication Administration Record (MAR).
        </Text>
      </Flex>
    );
  }

  return (
    <ContentCard>
      <div style={{ marginBottom: 20 }}>
        <Flex vertical gap={8}>
          <Text strong>Select Admitted Patient:</Text>
          <Select
            style={{ width: 350 }}
            placeholder="Select a patient..."
            loading={loadingInpatients}
            value={selectedEncounterId || undefined}
            onChange={(value) => setSelectedEncounterId(value)}
            options={inpatients.map((ip) => ({
              label: `${ip.patientName} (${ip.mrn}) — Ward: ${ip.ward}, Bed: ${ip.bed}`,
              value: ip.id,
            }))}
          />
        </Flex>
      </div>
      {boardContent}
    </ContentCard>
  );
}
