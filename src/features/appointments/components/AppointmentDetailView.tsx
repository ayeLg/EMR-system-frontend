"use client";

import { useState } from "react";
import { App, Button, Card, Descriptions, Skeleton, Space, Tag } from "antd";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { useAppointment } from "../hooks/useAppointments";
import { APPT_STATUS_META, APPT_TYPE_LABEL } from "../constants";
import type { AppointmentStatus } from "../types";

/** Allowed next states per the appointment state machine. */
const TRANSITIONS: Record<
  AppointmentStatus,
  { to: AppointmentStatus; label: string; danger?: boolean }[]
> = {
  SCHEDULED: [
    { to: "ARRIVED", label: "Mark arrived" },
    { to: "CANCELLED", label: "Cancel", danger: true },
  ],
  ARRIVED: [
    { to: "IN_PROGRESS", label: "Start (nurse vitals → doctor)" },
    { to: "NO_SHOW", label: "No-show", danger: true },
  ],
  IN_PROGRESS: [{ to: "COMPLETED", label: "Complete" }],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export function AppointmentDetailView({ id }: { id: string }) {
  const { data, isLoading } = useAppointment(id);
  const { message } = App.useApp();
  const [override, setOverride] = useState<AppointmentStatus | null>(null);

  if (isLoading) return <Skeleton active paragraph={{ rows: 5 }} />;
  if (!data) return <EmptyState description="Appointment not found" />;

  const status = override ?? data.status;
  const actions = TRANSITIONS[status];

  return (
    <>
      <PageHeader
        title={data.appointmentNo}
        subtitle={`${data.patientName} · ${data.mrn}`}
        actions={
          <Tag color={APPT_STATUS_META[status].color}>
            {APPT_STATUS_META[status].label}
          </Tag>
        }
      />

      <Card size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label="Doctor">{data.doctorName}</Descriptions.Item>
          <Descriptions.Item label="Department">{data.department}</Descriptions.Item>
          <Descriptions.Item label="Scheduled">{data.scheduledAt}</Descriptions.Item>
          <Descriptions.Item label="Type">{APPT_TYPE_LABEL[data.type]}</Descriptions.Item>
          <Descriptions.Item label="Chief complaint">{data.chiefComplaint ?? "—"}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small" title="Status actions">
        {actions.length === 0 ? (
          <EmptyState description="No further actions (terminal state)" />
        ) : (
          <Space wrap>
            {actions.map((a) => (
              <Button
                key={a.to}
                type={a.danger ? "default" : "primary"}
                danger={a.danger}
                onClick={() => {
                  setOverride(a.to);
                  message.success(
                    `${data.appointmentNo}: ${status} → ${a.to}` +
                      (a.to === "IN_PROGRESS" ? " · doctor notified" : "") +
                      (a.to === "COMPLETED" ? " · billing capture triggered" : ""),
                  );
                }}
              >
                {a.label}
              </Button>
            ))}
          </Space>
        )}
      </Card>
    </>
  );
}
