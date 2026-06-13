"use client";

import { Card, Skeleton, Tag, Typography } from "antd";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { useLabOrder } from "../hooks/useLaboratory";
import { LAB_PRIORITY_META, LAB_STATUS_META } from "../constants";
import { ResultsEntry } from "./ResultsEntry";

const { Text } = Typography;

export function LabOrderDetailView({ id }: Readonly<{ id: string }>) {
  const { data, isLoading } = useLabOrder(id);

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (!data) return <EmptyState description="Lab order not found" />;

  return (
    <>
      <PageHeader
        title={data.orderNo}
        subtitle={`${data.patientName} · ${data.mrn}`}
        actions={
          <>
            <Tag color={LAB_PRIORITY_META[data.priority].color} style={{ marginInlineEnd: 8 }}>
              {LAB_PRIORITY_META[data.priority].label}
            </Tag>
            <Tag color={LAB_STATUS_META[data.status].color}>
              {LAB_STATUS_META[data.status].label}
            </Tag>
          </>
        }
      />
      {data.clinicalNotes ? (
        <Card size="small" style={{ marginBottom: 16 }}>
          <Text type="secondary">Clinical notes: </Text>
          {data.clinicalNotes}
        </Card>
      ) : null}
      <ResultsEntry key={data.id} items={data.items} orderId={data.id} status={data.status} />
    </>
  );
}
