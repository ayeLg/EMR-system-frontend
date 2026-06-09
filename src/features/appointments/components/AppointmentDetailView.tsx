"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Descriptions,
  Popconfirm,
  Skeleton,
  Space,
  Tag,
} from "antd";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ROUTES } from "@/config/routes";
import {
  useAppointment,
  useDeleteAppointment,
  useUpdateAppointment,
} from "../hooks/useAppointments";
import { APPT_STATUS_META, APPT_TYPE_LABEL } from "../constants";
import type { AppointmentStatus } from "../types";

const TRANSITIONS: Record<
  AppointmentStatus,
  { to: AppointmentStatus; label: string; danger?: boolean }[]
> = {
  SCHEDULED: [
    { to: "ARRIVED", label: "Mark arrived" },
    { to: "CANCELLED", label: "Cancel", danger: true },
  ],
  ARRIVED: [
    { to: "IN_PROGRESS", label: "Start" },
    { to: "NO_SHOW", label: "No-show", danger: true },
  ],
  IN_PROGRESS: [{ to: "COMPLETED", label: "Complete" }],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export function AppointmentDetailView({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading } = useAppointment(id);
  const { message } = App.useApp();
  const updateMutation = useUpdateAppointment();
  const deleteMutation = useDeleteAppointment();

  if (isLoading) return <Skeleton active paragraph={{ rows: 5 }} />;
  if (!data) return <EmptyState description="Appointment not found" />;

  const status = data.status;
  const actions = TRANSITIONS[status];

  return (
    <>
      <Button
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 12 }}
        onClick={() => router.push(ROUTES.appointments)}
      >
        Back
      </Button>

      <PageHeader
        title={data.appointmentNo}
        subtitle={`${data.patientName} - ${data.mrn}`}
        actions={
          <Space>
            <Tag color={APPT_STATUS_META[status].color}>
              {APPT_STATUS_META[status].label}
            </Tag>
            <Popconfirm
              title="Delete appointment?"
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
              onConfirm={() => {
                deleteMutation.mutate(id, {
                  onSuccess: () => {
                    message.success("Appointment deleted.");
                    router.push(ROUTES.appointments);
                  },
                  onError: () => message.error("Failed to delete appointment."),
                });
              }}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                loading={deleteMutation.isPending}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        }
      />

      <Card size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label="Doctor">{data.doctorName}</Descriptions.Item>
          <Descriptions.Item label="Department">
            {data.department}
          </Descriptions.Item>
          <Descriptions.Item label="Scheduled">
            {data.scheduledAt}
          </Descriptions.Item>
          <Descriptions.Item label="Type">
            {APPT_TYPE_LABEL[data.type]}
          </Descriptions.Item>
          <Descriptions.Item label="Chief complaint">
            {data.chiefComplaint ?? "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small" title="Status actions">
        {actions.length === 0 ? (
          <EmptyState description="No further actions (terminal state)" />
        ) : (
          <Space wrap>
            {actions.map((action) => (
              <Button
                key={action.to}
                type={action.danger ? "default" : "primary"}
                danger={action.danger}
                loading={updateMutation.isPending}
                onClick={() => {
                  updateMutation.mutate(
                    { id, payload: { status: action.to } },
                    {
                      onSuccess: () =>
                        message.success(
                          `${data.appointmentNo}: ${status} -> ${action.to}`,
                        ),
                      onError: () =>
                        message.error("Failed to update appointment."),
                    },
                  );
                }}
              >
                {action.label}
              </Button>
            ))}
          </Space>
        )}
      </Card>
    </>
  );
}
