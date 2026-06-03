"use client";

import { useState } from "react";
import type { TableProps } from "antd";
import { App, Button, Form, Input, InputNumber, Modal, Popconfirm, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { CreateButton } from "@/components/ui/CreateButton";
import type { MasterRow } from "./data";

export interface CrudField {
  name: string;
  label: string;
  type?: "text" | "number";
  required?: boolean;
}

interface MasterCrudProps {
  entity: string;
  columns: TableProps<MasterRow>["columns"];
  fields: CrudField[];
  initialData: MasterRow[];
}

export function MasterCrud({ entity, columns, fields, initialData }: MasterCrudProps) {
  const { message } = App.useApp();
  const [rows, setRows] = useState<MasterRow[]>(initialData);
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
  const remove = (row: MasterRow) => {
    setRows((p) => p.filter((r) => r.id !== row.id));
    message.success(`${entity} deleted (mock).`);
  };
  const submit = () =>
    form.validateFields().then((values) => {
      if (editing) {
        setRows((p) => p.map((r) => (r.id === editing.id ? { ...r, ...values } : r)));
        message.success(`${entity} updated (mock).`);
      } else {
        setRows((p) => [...p, { id: String(Date.now()), ...values }]);
        message.success(`${entity} created (mock).`);
      }
      setOpen(false);
    });

  const actionCol: NonNullable<TableProps<MasterRow>["columns"]>[number] = {
    title: "Actions",
    key: "actions",
    width: 120,
    render: (_, r) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
        <Popconfirm title="Delete this item?" onConfirm={() => remove(r)} okText="Delete" okButtonProps={{ danger: true }}>
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ),
  };

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
          columns={[...(columns ?? []), actionCol]}
          dataSource={rows}
        />
      </ContentCard>

      <Modal
        open={open}
        title={`${editing ? "Edit" : "Add"} ${entity}`}
        okText={editing ? "Save" : "Create"}
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
