"use client";

import { useEffect } from "react";
import { Form, InputNumber, Modal, Select, TimePicker } from "antd";
import dayjs from "dayjs";
import type { DoctorSchedule, DoctorSchedulePayload } from "../types";
import { DAY_OPTIONS } from "../types";

interface DoctorOption {
  label: string;
  value: string;
}

export function ScheduleFormModal({
  open,
  schedule,
  doctors,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  schedule: DoctorSchedule | null;
  doctors: DoctorOption[];
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: DoctorSchedulePayload) => Promise<void>;
}) {
  const [form] = Form.useForm();
  const isEdit = !!schedule;

  useEffect(() => {
    if (!open) return;
    if (schedule) {
      form.setFieldsValue({
        doctorId: schedule.doctorId,
        dayOfWeek: schedule.dayOfWeek,
        time: [dayjs(schedule.startTime, "HH:mm"), dayjs(schedule.endTime, "HH:mm")],
        slotMinutes: schedule.slotMinutes,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ slotMinutes: 15, dayOfWeek: 1 });
    }
  }, [open, schedule, form]);

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit doctor schedule" : "Add doctor schedule"}
      okText={isEdit ? "Save" : "Create"}
      confirmLoading={loading}
      onOk={() =>
        form.validateFields().then(async (values) => {
          const payload: DoctorSchedulePayload = {
            doctorId: values.doctorId,
            dayOfWeek: values.dayOfWeek,
            startTime: values.time[0].format("HH:mm"),
            endTime: values.time[1].format("HH:mm"),
            slotMinutes: values.slotMinutes ?? 15,
          };
          await onSubmit(payload);
          form.resetFields();
          onClose();
        })
      }
      onCancel={onClose}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item name="doctorId" label="Doctor" rules={[{ required: true }]}>
          <Select
            showSearch
            optionFilterProp="label"
            options={doctors}
            placeholder="Select doctor"
          />
        </Form.Item>
        <Form.Item name="dayOfWeek" label="Day" rules={[{ required: true }]}>
          <Select options={[...DAY_OPTIONS]} />
        </Form.Item>
        <Form.Item name="time" label="Hours" rules={[{ required: true }]}>
          <TimePicker.RangePicker format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="slotMinutes" label="Slot (minutes)" rules={[{ required: true }]}>
          <InputNumber min={5} max={120} step={5} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
