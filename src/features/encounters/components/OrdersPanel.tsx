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
import {
  useEncounter,
  useLabTests,
  useCreateLabOrder,
  useCreateMedicalOrder,
} from "../hooks/useEncounters";
import { AllergyAlertModal } from "./AllergyAlertModal";

const ROUTE_OPTIONS = [
  { label: "Oral", value: "ORAL" },
  { label: "IV", value: "IV" },
  { label: "IM", value: "IM" },
  { label: "SC", value: "SC" },
  { label: "Topical", value: "TOPICAL" },
  { label: "Inhaled", value: "INHALED" },
  { label: "Sublingual", value: "SUBLINGUAL" },
];

const PRIORITY_OPTIONS = [
  { label: "Routine", value: "ROUTINE" },
  { label: "Urgent", value: "URGENT" },
  { label: "STAT", value: "STAT" },
];

const ORDER_TYPE_OPTIONS = [
  { label: "Radiology", value: "RADIOLOGY" },
  { label: "Diet", value: "DIET" },
  { label: "Nursing", value: "NURSING" },
  { label: "Referral", value: "REFERRAL" },
];

type LabOrderFormValues = {
  labTestIds: string[];
  priority?: "STAT" | "URGENT" | "ROUTINE";
  clinicalNotes?: string;
};

type MedicalOrderFormValues = {
  orderType: "RADIOLOGY" | "DIET" | "NURSING" | "REFERRAL";
  description: string;
  priority?: "STAT" | "URGENT" | "ROUTINE";
  notes?: string;
};

interface OrderItem {
  label: string;
  type: "rx" | "lab" | "radiology";
}

function tagColor(type: OrderItem["type"]) {
  if (type === "rx") return "blue";
  if (type === "lab") return "purple";
  return "cyan";
}

export function OrdersPanel({
  encounterId,
  readOnly = false,
}: Readonly<{ encounterId: string; readOnly?: boolean }>) {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [labModalOpen, setLabModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [labForm] = Form.useForm<LabOrderFormValues>();
  const [orderForm] = Form.useForm<MedicalOrderFormValues>();
  // Set when the backend blocks a prescription due to a drug allergy.
  const [allergyAlert, setAllergyAlert] = useState<{
    drug: string;
    allergen: string;
    values: CreatePrescriptionPayload;
  } | null>(null);

  // Queries & Mutations
  const { data: encounter } = useEncounter(encounterId);
  const { data: labTests = [], isLoading: loadingLabTests } = useLabTests();
  const createLabOrderMutation = useCreateLabOrder(encounterId);
  const createMedicalOrderMutation = useCreateMedicalOrder(encounterId);

  const { data: medications = [], isLoading: loadingMeds } = useQuery({
    queryKey: ["medications"],
    queryFn: getMedications,
  });

  const submitPrescription = async (
    values: CreatePrescriptionPayload,
    overrideReason?: string,
  ) => {
    setSubmitting(true);
    try {
      await createPrescription(encounterId, { ...values, overrideReason });
      const med = medications.find((m) => m.id === values.medicationId);
      const label = med ? `${med.genericName} ${med.strength}` : "Drug";
      setOrders((prev) => [...prev, { label: `Rx · ${label}`, type: "rx" }]);
      message.success(`Prescribed ${label} successfully.`);
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      form.resetFields();
      setModalOpen(false);
      setAllergyAlert(null);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      const msg = apiErr.message ?? "Failed to prescribe";

      // First attempt blocked by a drug allergy → open the override modal.
      if (!overrideReason && /allergy alert/i.test(msg)) {
        const med = medications.find((m) => m.id === values.medicationId);
        const drug = med ? med.genericName : "Selected drug";
        const allergen =
          msg.match(/allergy alert:\s*([^.]+)\./i)?.[1]?.trim() ??
          "a recorded allergy";
        setModalOpen(false);
        setAllergyAlert({ drug, allergen, values });
        return;
      }

      if (overrideReason) setAllergyAlert(null);
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrescribe = async () => {
    let values: CreatePrescriptionPayload;
    try {
      values = (await form.validateFields()) as CreatePrescriptionPayload;
    } catch {
      return; // field validation errors are shown inline
    }
    await submitPrescription(values);
  };

  const handleLabOrder = async () => {
    let values: LabOrderFormValues;
    try {
      values = await labForm.validateFields();
    } catch {
      return;
    }
    try {
      await createLabOrderMutation.mutateAsync({
        labTestIds: values.labTestIds,
        priority: values.priority,
        clinicalNotes: values.clinicalNotes?.trim() || undefined,
      });
      const names = labTests
        .filter((t) => values.labTestIds.includes(t.id))
        .map((t) => t.name);
      message.success(
        `Lab order placed: ${names.join(", ") || values.labTestIds.length + " test(s)"}.`,
      );
      labForm.resetFields();
      setLabModalOpen(false);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      message.error(apiErr.message ?? "Failed to place lab order");
    }
  };

  const handleMedicalOrder = async () => {
    let values: MedicalOrderFormValues;
    try {
      values = await orderForm.validateFields();
    } catch {
      return;
    }
    try {
      await createMedicalOrderMutation.mutateAsync({
        orderType: values.orderType,
        description: values.description.trim(),
        priority: values.priority,
        notes: values.notes?.trim() || undefined,
      });
      message.success(`Order placed: ${values.description.trim()}.`);
      orderForm.resetFields();
      setOrderModalOpen(false);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      message.error(apiErr.message ?? "Failed to place order");
    }
  };

  // Map backend labOrders and medicalOrders
  const backendLabOrders = encounter?.labOrders.flatMap((lo) =>
    lo.items.map((item) => ({
      label: `Lab · ${item.name}`,
      type: "lab" as const,
    }))
  ) ?? [];

  const backendMedicalOrders = encounter?.medicalOrders.map((mo) => ({
    label: `${mo.orderType === "RADIOLOGY" ? "Radiology" : mo.orderType} · ${mo.description}`,
    type: (mo.orderType === "RADIOLOGY" ? "radiology" : "rx") as "radiology" | "rx" | "lab",
  })) ?? [];

  const displayedOrders = [...orders, ...backendLabOrders, ...backendMedicalOrders];

  return (
    <Flex vertical gap={16}>
      {readOnly ? null : (
      <Card size="small" title="New orders">
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
            onClick={() => setLabModalOpen(true)}
          >
            Order lab
          </Button>
          <Button onClick={() => setOrderModalOpen(true)}>New order</Button>
        </Space>
      </Card>
      )}

      <Card size="small" title={`Orders placed (${displayedOrders.length})`}>
        {displayedOrders.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No orders yet" />
        ) : (
          <Flex vertical gap={8}>
            {displayedOrders.map((o, i) => (
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
            <Input.TextArea placeholder="Special instructions (sig)..." rows={2} />
          </Form.Item>

          <Form.Item name="notes" label="Notes (optional)">
            <Input.TextArea placeholder="Prescription-level note..." rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={labModalOpen}
        title="Order lab tests"
        okText="Place order"
        onOk={handleLabOrder}
        onCancel={() => {
          setLabModalOpen(false);
          labForm.resetFields();
        }}
        confirmLoading={createLabOrderMutation.isPending}
        width={500}
      >
        <Form
          form={labForm}
          layout="vertical"
          initialValues={{ priority: "ROUTINE" }}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="labTestIds"
            label="Lab tests"
            rules={[{ required: true, message: "Select at least one test" }]}
          >
            <Select
              mode="multiple"
              showSearch
              loading={loadingLabTests}
              placeholder="Search tests..."
              optionFilterProp="label"
              options={labTests.map((t) => ({
                value: t.id,
                label: `${t.name} (${t.code})`,
              }))}
            />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select options={PRIORITY_OPTIONS} />
          </Form.Item>
          <Form.Item name="clinicalNotes" label="Clinical notes">
            <Input.TextArea
              rows={2}
              placeholder="Indication / clinical context..."
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={orderModalOpen}
        title="New order"
        okText="Place order"
        onOk={handleMedicalOrder}
        onCancel={() => {
          setOrderModalOpen(false);
          orderForm.resetFields();
        }}
        confirmLoading={createMedicalOrderMutation.isPending}
        width={500}
      >
        <Form
          form={orderForm}
          layout="vertical"
          initialValues={{ orderType: "RADIOLOGY", priority: "ROUTINE" }}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="orderType"
            label="Order type"
            rules={[{ required: true, message: "Select an order type" }]}
          >
            <Select options={ORDER_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Enter the order description" }]}
          >
            <Input placeholder="e.g. Brain CT Scan (non-contrast)" />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select options={PRIORITY_OPTIONS} />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} placeholder="Reason / clinical context..." />
          </Form.Item>
        </Form>
      </Modal>

      {allergyAlert ? (
        <AllergyAlertModal
          open
          drug={allergyAlert.drug}
          allergen={allergyAlert.allergen}
          onOverride={(reason) =>
            void submitPrescription(allergyAlert.values, reason)
          }
          onCancel={() => {
            setAllergyAlert(null);
            setModalOpen(true); // back to the form to change the drug
          }}
        />
      ) : null}
    </Flex>
  );
}
