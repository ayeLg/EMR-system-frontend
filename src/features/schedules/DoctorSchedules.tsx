"use client";

import { useState } from "react";
import type { TableProps } from "antd";
import { App, Form, Input, InputNumber, Modal, Select, TimePicker } from "antd";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { CreateButton } from "@/components/ui/CreateButton";

interface ScheduleRow {
  id: string;
  doctor: string;
  day: string;
  start: string;
  end: string;
  slotMinutes: number;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({ label: d, value: d }));
const DOCTORS = ["Dr. Aung Aung", "Dr. Hla Hla", "Dr. Kyaw Min"].map((d) => ({ label: d, value: d }));

const MOCK_SCHEDULES: ScheduleRow[] = [
  { id: "1", doctor: "Dr. Aung Aung", day: "Mon", start: "09:00", end: "12:00", slotMinutes: 15 },
  { id: "2", doctor: "Dr. Aung Aung", day: "Wed", start: "13:00", end: "17:00", slotMinutes: 15 },
  { id: "3", doctor: "Dr. Hla Hla", day: "Tue", start: "08:00", end: "12:00", slotMinutes: 20 },
];

export function DoctorSchedules() {
  const { message } = App.useApp();
  const [rows, setRows] = useState<ScheduleRow[]>(MOCK_SCHEDULES);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const columns: TableProps<ScheduleRow>["columns"] = [
    { title: "Doctor", dataIndex: "doctor", key: "doctor" },
    { title: "Day", dataIndex: "day", key: "day" },
    { title: "Start", dataIndex: "start", key: "start" },
    { title: "End", dataIndex: "end", key: "end" },
    { title: "Slot (min)", dataIndex: "slotMinutes", key: "slotMinutes" },
  ];

  return (
    <>
      <ContentCard
        toolbar={
          <PageToolbar
            actions={<CreateButton onClick={() => setOpen(true)}>Add schedule</CreateButton>}
          />
        }
      >
        <DataTable<ScheduleRow> rowKey="id" columns={columns} dataSource={rows} />
      </ContentCard>

      <Modal
        open={open}
        title="Add doctor schedule"
        okText="Create"
        onOk={() =>
          form.validateFields().then((v) => {
            setRows((p) => [
              ...p,
              {
                id: String(Date.now()),
                doctor: v.doctor,
                day: v.day,
                start: v.time?.[0]?.format("HH:mm") ?? "09:00",
                end: v.time?.[1]?.format("HH:mm") ?? "17:00",
                slotMinutes: v.slotMinutes ?? 15,
              },
            ]);
            message.success("Schedule added (mock).");
            form.resetFields();
            setOpen(false);
          })
        }
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="doctor" label="Doctor" rules={[{ required: true }]}>
            <Select options={DOCTORS} />
          </Form.Item>
          <Form.Item name="day" label="Day" rules={[{ required: true }]}>
            <Select options={DAYS} />
          </Form.Item>
          <Form.Item name="time" label="Hours" rules={[{ required: true }]}>
            <TimePicker.RangePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="slotMinutes" label="Slot minutes" initialValue={15}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="note" label="Note" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
