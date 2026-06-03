"use client";

import { useEffect } from "react";
import { App, Form, Input, Modal, Select } from "antd";
import type { StaffUser } from "../types";

const ROLE_OPTIONS = [
  "SUPER_ADMIN",
  "DOCTOR",
  "NURSE",
  "RECEPTIONIST",
  "PHARMACIST",
  "LAB_TECH",
  "BILLING_STAFF",
].map((r) => ({ label: r, value: r }));

export function AddUserModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user?: StaffUser | null;
}) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const isEdit = !!user;

  useEffect(() => {
    if (!open) return;
    if (user) form.setFieldsValue(user);
    else form.resetFields();
  }, [open, user, form]);

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit staff user" : "Add staff user"}
      okText={isEdit ? "Save" : "Create"}
      onOk={() =>
        form.validateFields().then(() => {
          message.success(
            isEdit
              ? "Staff user updated (mock)."
              : "Staff user created (mock). Invite email sent.",
          );
          form.resetFields();
          onClose();
        })
      }
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="fullName" label="Full name" rules={[{ required: true }]}>
          <Input placeholder="Full name" />
        </Form.Item>
        <Form.Item name="employeeId" label="Employee ID" rules={[{ required: true }]}>
          <Input placeholder="EMP-000" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input placeholder="name@hospital.mm" />
        </Form.Item>
        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select options={ROLE_OPTIONS} placeholder="Select role" />
        </Form.Item>
        <Form.Item name="department" label="Department">
          <Input placeholder="Department" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
