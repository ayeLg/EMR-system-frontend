"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Form,
  Modal,
  Popconfirm,
  Select,
  Space,
  Tag,
  Tooltip,
  type TableProps,
} from "antd";
import { useTranslations } from "next-intl";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { SearchInput } from "@/components/ui/SearchInput";
import { ROUTES } from "@/config/routes";
import {
  useAppointments,
  useDeleteAppointment,
  useUpdateAppointment,
} from "../hooks/useAppointments";
import {
  APPT_STATUS_META,
  APPT_TYPE_LABEL,
  STATUS_FILTER_OPTIONS,
} from "../constants";
import type { Appointment } from "../types";

export function AppointmentTable() {
  const t = useTranslations("common");
  const router = useRouter();
  const { message } = App.useApp();
  const { data, isLoading } = useAppointments();
  const deleteMutation = useDeleteAppointment();
  const updateMutation = useUpdateAppointment();
  const [status, setStatus] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [form] = Form.useForm<{ status: Appointment["status"] }>();

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
      render: (_, r) => `${r.patientName} - ${r.mrn}`,
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
    {
      title: "",
      key: "actions",
      width: 124,
      render: (_, r) => (
        <Space size={2} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="View details">
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => router.push(`${ROUTES.appointments}/${r.id}`)}
              aria-label="View appointment"
            />
          </Tooltip>
          <Tooltip title="Edit status">
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditing(r);
                form.setFieldsValue({ status: r.status });
              }}
              aria-label="Edit appointment"
            />
          </Tooltip>
          <Popconfirm
            title="Delete appointment?"
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
            onConfirm={() => {
              deleteMutation.mutate(r.id, {
                onSuccess: () => message.success("Appointment deleted."),
                onError: () => message.error("Failed to delete appointment."),
              });
            }}
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                shape="circle"
                size="small"
                icon={<DeleteOutlined />}
                aria-label="Delete appointment"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
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
      <Modal
        open={Boolean(editing)}
        title="Edit appointment"
        okText="Save"
        confirmLoading={updateMutation.isPending}
        onCancel={() => setEditing(null)}
        onOk={() => {
          if (!editing) return;
          void form
            .validateFields()
            .then((values) => {
              updateMutation.mutate(
                { id: editing.id, payload: { status: values.status } },
                {
                  onSuccess: () => {
                    message.success("Appointment updated.");
                    setEditing(null);
                  },
                  onError: () => message.error("Failed to update appointment."),
                },
              );
            })
            .catch(() => undefined);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Select status" }]}
          >
            <Select options={STATUS_FILTER_OPTIONS} />
          </Form.Item>
        </Form>
      </Modal>
    </ContentCard>
  );
}
