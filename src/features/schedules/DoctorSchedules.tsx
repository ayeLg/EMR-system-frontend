"use client";

import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import { App, Button, Popconfirm, Select, Space, Switch } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { CreateButton } from "@/components/ui/CreateButton";
import { useStaff } from "@/features/users/hooks/useStaff";
import { ScheduleFormModal } from "./components/ScheduleFormModal";
import { useDoctorSchedules } from "./hooks/useDoctorSchedules";
import { DAY_OPTIONS, type DoctorSchedule } from "./types";

export function DoctorSchedules() {
  const { message } = App.useApp();
  const { data: staff = [], isLoading: loadingStaff } = useStaff();
  const [doctorFilter, setDoctorFilter] = useState<string | undefined>();
  const [dayFilter, setDayFilter] = useState<number | undefined>();
  const { rows, isLoading, create, update, remove, toggleActive } = useDoctorSchedules({
    doctorId: doctorFilter,
    dayOfWeek: dayFilter,
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DoctorSchedule | null>(null);

  const doctors = useMemo(
    () =>
      staff
        .filter((u) => u.role === "DOCTOR" && u.status === "ACTIVE")
        .map((u) => ({ label: u.fullName, value: u.id })),
    [staff],
  );

  const columns: TableProps<DoctorSchedule>["columns"] = [
    { title: "Doctor", dataIndex: "doctorName", key: "doctorName" },
    { title: "Day", dataIndex: "dayLabel", key: "dayLabel", width: 88 },
    { title: "Start", dataIndex: "startTime", key: "startTime", width: 88 },
    { title: "End", dataIndex: "endTime", key: "endTime", width: 88 },
    { title: "Slot (min)", dataIndex: "slotMinutes", key: "slotMinutes", width: 100 },
    {
      title: "Active",
      key: "isActive",
      width: 88,
      render: (_, row) => (
        <Switch
          checked={row.isActive}
          loading={toggleActive.isPending && toggleActive.variables?.id === row.id}
          onChange={(checked) =>
            void toggleActive.mutateAsync({ id: row.id, isActive: checked }).then(() =>
              message.success(`Schedule ${checked ? "activated" : "deactivated"}.`),
            )
          }
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, row) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(row);
              setOpen(true);
            }}
          />
          <Popconfirm
            title="Delete this schedule?"
            description="Existing appointments are not removed."
            onConfirm={() =>
              void remove.mutateAsync(row.id).then(() => message.success("Schedule deleted."))
            }
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const saving = create.isPending || update.isPending;

  return (
    <>
      <ContentCard
        toolbar={
          <PageToolbar
            filters={
              <Space wrap>
                <Select
                  allowClear
                  placeholder="All doctors"
                  style={{ minWidth: 200 }}
                  loading={loadingStaff}
                  value={doctorFilter}
                  onChange={setDoctorFilter}
                  options={doctors}
                />
                <Select
                  allowClear
                  placeholder="All days"
                  style={{ minWidth: 140 }}
                  value={dayFilter}
                  onChange={setDayFilter}
                  options={[...DAY_OPTIONS]}
                />
              </Space>
            }
            actions={
              <CreateButton
                onClick={() => {
                  setEditing(null);
                  setOpen(true);
                }}
              >
                Add schedule
              </CreateButton>
            }
          />
        }
      >
        <DataTable<DoctorSchedule>
          rowKey="id"
          columns={columns}
          dataSource={rows}
          loading={isLoading}
        />
      </ContentCard>

      <ScheduleFormModal
        open={open}
        schedule={editing}
        doctors={doctors}
        loading={saving}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSubmit={async (payload) => {
          try {
            if (editing) {
              await update.mutateAsync({ id: editing.id, payload });
              message.success("Schedule updated.");
            } else {
              await create.mutateAsync(payload);
              message.success("Schedule created.");
            }
          } catch (err) {
            const apiErr = err as { message?: string };
            message.error(apiErr.message ?? "Save failed");
            throw err;
          }
        }}
      />
    </>
  );
}
