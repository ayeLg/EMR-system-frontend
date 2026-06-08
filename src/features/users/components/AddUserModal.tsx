"use client";

import { useEffect } from "react";
import { App, Form, Input, Modal, Select } from "antd";
import type { StaffUser } from "../types";
import { useCreateUser, useUpdateUser } from "../hooks/useStaff";
import { useRbacRoles } from "../../rbac/hooks/useRbac";
import { useDepartments } from "../../master-data/hooks/useDepartments";

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

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const { data: roles = [], isLoading: loadingRoles } = useRbacRoles();
  const { data: departments = [], isLoading: loadingDepts } = useDepartments();

  const roleOptions = roles.map((r) => ({
    label: r.name,
    value: r.code,
  }));

  const departmentOptions = (departments ?? [])
    .filter((d) => d.isActive)
    .map((d) => ({
      label: d.name as string,
      value: d.name as string,
    }));

  useEffect(() => {
    if (!open) return;
    if (user) form.setFieldsValue(user);
    else form.resetFields();
  }, [open, user, form]);

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (isEdit && user) {
          await updateUserMutation.mutateAsync({
            id: user.id,
            payload: values,
          });
          message.success("Staff user updated successfully.");
        } else {
          await createUserMutation.mutateAsync(values);
          message.success("Staff user created. Default password is 'Welcome123!'.");
        }
        form.resetFields();
        onClose();
      } catch (err: any) {
        message.error(err.message || "Failed to save staff user");
      }
    });
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit staff user" : "Add staff user"}
      okText={isEdit ? "Save" : "Create"}
      confirmLoading={createUserMutation.isPending || updateUserMutation.isPending}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="fullName" label="Full name" rules={[{ required: true }]}>
          <Input placeholder="Full name" />
        </Form.Item>
        {isEdit && (
          <Form.Item name="employeeId" label="Employee ID">
            <Input disabled />
          </Form.Item>
        )}
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input placeholder="name@hospital.mm" />
        </Form.Item>
        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select
            options={roleOptions}
            loading={loadingRoles}
            placeholder="Select role"
          />
        </Form.Item>
        <Form.Item name="department" label="Department">
          <Select
            options={departmentOptions}
            loading={loadingDepts}
            allowClear
            placeholder="Select department"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
