"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  App,
  Button,
  Card,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Tag,
} from "antd";
import { ExperimentOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import { getMedications } from "@/features/pharmacy/api/pharmacy-api";
import {
  createPrescription,
  type CreatePrescriptionPayload,
} from "../api/encounters-api";

const ROUTE_OPTIONS = [
  { label: "Oral", value: "ORAL" },
  { label: "IV", value: "IV" },
  { label: "IM", value: "IM" },
  { label: "SC", value: "SC" },
  { label: "Topical", value: "TOPICAL" },
  { label: "Inhaled", value: "INHALED" },
  { label: "Sublingual", value: "SUBLINGUAL" },
];

interface OrderItem {
  label: string;
  type: "rx" | "lab" | "radiology";
}

function tagColor(type: OrderItem["type"]) {
  if (type === "rx") return "blue";
  if (type === "lab") return "purple";
  return "cyan";
}

export function OrdersPanel({ encounterId }: Readonly<{ encounterId: string }>) {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const { data: medications = [], isLoading: loadingMeds } = useQuery({
    queryKey: ["medications"],
    queryFn: getMedications,
  });

  const handlePrescribe = async () => {
    try {
      const values = await form.validateFields() as CreatePrescriptionPayload;
      setSubmitting(true);
      await createPrescription(encounterId, values);
      const med = medications.find((m) => m.id === values.medicationId);
      const label = med ? `${med.genericName} ${med.strength}` : "Drug";
      setOrders((prev) => [...prev, { label: `Rx · ${label}`, type: "rx" }]);
      message.success(`Prescribed ${label} successfully.`);
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      form.resetFields();
      setModalOpen(false);
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string | string[] } };
        message?: string;
      };
      const msg = apiErr.response?.data?.message ?? apiErr.message ?? "Failed to prescribe";
      message.error(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Flex vertical gap={16}>
      <Card size="small" title="New prescription">
        <Space wrap>
          <Button
            type="primary"
            icon={<MedicineBoxOutlined />}
            onClick={() => setModalOpen(true)}
          >
            Prescribe
          </Button>
          <Button
            icon={<ExperimentOutlined />}
            onClick={() => {
              setOrders((p) => [...p, { label: "Lab · CBC", type: "lab" }]);
              message.success("Lab order placed: CBC.");
            }}
          >
            Order lab (CBC)
          </Button>
          <Button
            onClick={() => {
              setOrders((p) => [
                ...p,
                { label: "Radiology · Chest X-ray", type: "radiology" },
              ]);
              message.success("Radiology order placed: Chest X-ray.");
            }}
          >
            Order X-ray
          </Button>
        </Space>
      </Card>

      <Card size="small" title={`Orders placed (${orders.length})`}>
        {orders.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No orders yet" />
        ) : (
          <Flex vertical gap={8}>
            {orders.map((o, i) => (
              <Tag key={`${o.label}-${i}`} color={tagColor(o.type)}>
                {o.label}
              </Tag>
            ))}
          </Flex>
        )}
      </Card>

      <Modal
        open={modalOpen}
        title="New Prescription"
        okText="Prescribe"
        cancelText="Cancel"
        onOk={handlePrescribe}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        confirmLoading={submitting}
        width={500}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="medicationId"
            label="Medication"
            rules={[{ required: true, message: "Please select a medication" }]}
          >
            <Select
              showSearch
              loading={loadingMeds}
              placeholder="Search medication..."
              optionFilterProp="label"
              options={medications.map((m) => ({
                value: m.id,
                label: `${m.genericName} (${m.strength})`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="dose"
            label="Dose"
            rules={[{ required: true, message: "e.g. 500mg" }]}
          >
            <Input placeholder="e.g. 500mg" />
          </Form.Item>

          <Form.Item
            name="route"
            label="Route"
            rules={[{ required: true, message: "Please select route" }]}
          >
            <Select options={ROUTE_OPTIONS} placeholder="Select route" />
          </Form.Item>

          <Form.Item
            name="frequency"
            label="Frequency"
            rules={[{ required: true, message: "e.g. TDS, OD, BD" }]}
          >
            <Input placeholder="e.g. TDS, OD, BD" />
          </Form.Item>

          <Form.Item
            name="quantityPrescribed"
            label="Quantity"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item name="durationDays" label="Duration (days)">
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item name="instructions" label="Instructions">
            <Input.TextArea placeholder="Special instructions..." rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
}
