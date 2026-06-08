"use client";

import { useState } from "react";
import type { TableProps } from "antd";
import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { CreateButton } from "@/components/ui/CreateButton";
import { useDepartments } from "./hooks/useDepartments";
import { useMasterData } from "./hooks/useMasterData";
import type { MasterResource, MasterRow } from "./types";

export interface CrudField {
  name: string;
  label: string;
  type?: "text" | "number" | "select";
  required?: boolean;
  /** For `select` — static options or loaded elsewhere via `selectFromDepartments`. */
  options?: { label: string; value: string }[];
  selectFromDepartments?: boolean;
}

interface MasterCrudProps {
  resource: MasterResource;
  entity: string;
  columns: TableProps<MasterRow>["columns"];
  fields: CrudField[];
  /** Show `isActive` column with Switch (departments: calls PATCH …/is-active). */
  showActiveToggle?: boolean;
}

export function MasterCrud({
  resource,
  entity,
  columns,
  fields,
  showActiveToggle = false,
}: MasterCrudProps) {
  const { message } = App.useApp();
  const { rows, isLoading, create, update, remove, toggleActive } =
    useMasterData(resource);
  const { data: departments } = useDepartments();
  const [editing, setEditing] = useState<MasterRow | null>(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (row: MasterRow) => {
    setEditing(row);
    form.setFieldsValue(row);
    setOpen(true);
  };

  const handleRemove = async (row: MasterRow) => {
    try {
      await remove.mutateAsync(row.id);
      message.success(`${entity} deleted.`);
    } catch (err) {
      const apiErr = err as { message?: string };
      message.error(apiErr.message ?? "Delete failed");
    }
  };

  const submit = () =>
    form.validateFields().then(async (values) => {
      try {
        if (editing) {
          await update.mutateAsync({ id: editing.id, payload: values });
          message.success(`${entity} updated.`);
        } else {
          await create.mutateAsync(values);
          message.success(`${entity} created.`);
        }
        setOpen(false);
      } catch (err) {
        const apiErr = err as { message?: string };
        message.error(apiErr.message ?? "Save failed");
      }
    });

  const fieldOptions = (field: CrudField) => {
    if (field.options) return field.options;
    if (field.selectFromDepartments) {
      return (departments ?? []).map((d) => ({
        label: d.name as string,
        value: d.id as string,
      }));
    }
    return [];
  };

  const handleToggleActive = async (row: MasterRow, isActive: boolean) => {
    try {
      await toggleActive.mutateAsync({ id: row.id, isActive });
      message.success(`${entity} ${isActive ? "activated" : "deactivated"}.`);
    } catch (err) {
      const apiErr = err as { message?: string };
      message.error(apiErr.message ?? "Update failed");
    }
  };

  const activeCol: NonNullable<TableProps<MasterRow>["columns"]>[number] | null =
    showActiveToggle
      ? {
          title: "Active",
          key: "isActive",
          width: 88,
          render: (_, row) => (
            <Switch
              checked={Boolean(row.isActive)}
              loading={
                toggleActive.isPending && toggleActive.variables?.id === row.id
              }
              onChange={(checked) => void handleToggleActive(row, checked)}
            />
          ),
        }
      : null;

  const actionCol: NonNullable<TableProps<MasterRow>["columns"]>[number] = {
    title: "Actions",
    key: "actions",
    width: 120,
    render: (_, r) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
        <Popconfirm
          title="Delete this item?"
          onConfirm={() => void handleRemove(r)}
          okText="Delete"
          okButtonProps={{ danger: true }}
        >
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ),
  };

  const saving = create.isPending || update.isPending;

  return (
    <>
      <ContentCard
        toolbar={
          <PageToolbar
            actions={<CreateButton onClick={openAdd}>Add {entity}</CreateButton>}
          />
        }
      >
        <DataTable<MasterRow>
          rowKey="id"
          columns={[
            ...(columns ?? []),
            ...(activeCol ? [activeCol] : []),
            actionCol,
          ]}
          dataSource={rows}
          loading={isLoading}
        />
      </ContentCard>

      <Modal
        open={open}
        title={`${editing ? "Edit" : "Add"} ${entity}`}
        okText={editing ? "Save" : "Create"}
        confirmLoading={saving}
        onOk={submit}
        onCancel={() => setOpen(false)}
      >
        <Form form={form} layout="vertical">
          {fields.map((f) => (
            <Form.Item
              key={f.name}
              name={f.name}
              label={f.label}
              rules={f.required ? [{ required: true }] : undefined}
            >
              {f.type === "number" ? (
                <InputNumber style={{ width: "100%" }} />
              ) : f.type === "select" ? (
                <Select
                  options={fieldOptions(f)}
                  showSearch
                  optionFilterProp="label"
                  placeholder="Select"
                />
              ) : (
                <Input />
              )}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </>
  );
}
