"use client";

import { App, Form, Input, Modal, Select } from "antd";
import { useAddAllergy } from "../hooks/usePatientMutations";
import type { AddAllergyPayload } from "../api/patients-api";

const TYPE_OPTIONS = [
  { label: "Drug", value: "DRUG" },
  { label: "Food", value: "FOOD" },
  { label: "Environmental", value: "ENVIRONMENTAL" },
  { label: "Other", value: "OTHER" },
];

const SEVERITY_OPTIONS = [
  { label: "Mild", value: "MILD" },
  { label: "Moderate", value: "MODERATE" },
  { label: "Severe", value: "SEVERE" },
  { label: "Fatal", value: "FATAL" },
];

interface AllergyFormModalProps {
  patientId: string;
  open: boolean;
  onCancel: () => void;
}

export function AllergyFormModal({
  patientId,
  open,
  onCancel,
}: AllergyFormModalProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const addAllergy = useAddAllergy(patientId);

  const handleSubmit = async () => {
    try {
      const values = (await form.validateFields()) as AddAllergyPayload;
      await addAllergy.mutateAsync(values);
      message.success("Allergy added successfully.");
      form.resetFields();
      onCancel();
    } catch (err: unknown) {
      // Validate fields throws error if validation fails; ignore it
      if (err instanceof Error) {
        message.error(err.message || "Failed to add allergy");
      }
    }
  };

  return (
    <Modal
      open={open}
      title="Add Patient Allergy"
      okText="Save"
      cancelText="Cancel"
      onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      confirmLoading={addAllergy.isPending}
      width={480}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="allergenName"
          label="Allergen Name"
          rules={[{ required: true, message: "Please enter allergen name (e.g. Paracetamol)" }]}
        >
          <Input placeholder="e.g. Paracetamol, Peanuts" />
        </Form.Item>

        <Form.Item
          name="allergenType"
          label="Allergen Type"
          rules={[{ required: true, message: "Please select allergen type" }]}
        >
          <Select placeholder="Select type" options={TYPE_OPTIONS} />
        </Form.Item>

        <Form.Item
          name="severity"
          label="Severity"
          rules={[{ required: true, message: "Please select severity" }]}
        >
          <Select placeholder="Select severity" options={SEVERITY_OPTIONS} />
        </Form.Item>

        <Form.Item name="reaction" label="Reaction (Optional)">
          <Input.TextArea placeholder="e.g. skin rash, hives, difficulty breathing" rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
