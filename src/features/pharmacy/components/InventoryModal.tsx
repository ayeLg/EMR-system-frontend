"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { App, DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import dayjs from "dayjs";
import { createInventory, getMedications, updateInventory } from "../api/pharmacy-api";
import type { InventoryItem } from "../types";

export function InventoryModal({
  open,
  onClose,
  onSaved,
  item,
}: Readonly<{
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  item: InventoryItem | null;
}>) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Load medications options for the select dropdown (only needed when adding a new batch)
  const { data: medications, isLoading: loadingMeds } = useQuery({
    queryKey: ["medications"],
    queryFn: getMedications,
    enabled: open && !item,
  });

  // Reset/populate form values when modal opens or editing item changes
  useEffect(() => {
    if (open) {
      if (item) {
        form.setFieldsValue({
          batchNumber: item.batchNumber,
          expiryDate: item.expiryDate ? dayjs(item.expiryDate) : null,
          quantityOnHand: item.quantityOnHand,
          reorderLevel: item.reorderLevel,
          unitCost: 1, // Default fallback since it's not stored in FE type
          supplier: "",
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          quantityOnHand: 0,
          reorderLevel: 50,
          unitCost: 0.1,
        });
      }
    }
  }, [open, item, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const payload = {
        ...values,
        expiryDate: values.expiryDate.format("YYYY-MM-DD"),
      };

      if (item) {
        await updateInventory(item.id, payload);
        message.success("Inventory batch updated successfully.");
      } else {
        await createInventory(payload);
        message.success("New stock batch received successfully.");
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string | string[] } }; message?: string };
      const msg = apiErr.response?.data?.message || apiErr.message || "Failed to save inventory item";
      message.error(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={item ? "Edit Inventory Batch" : "Receive Stock (Add Batch)"}
      okText={item ? "Save Changes" : "Receive Stock"}
      cancelText="Cancel"
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={submitting}
      width={480}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {!item && (
          <Form.Item
            name="medicationId"
            label="Select Medication"
            rules={[{ required: true, message: "Please select a medication" }]}
          >
            <Select
              loading={loadingMeds}
              placeholder="Search or select medication..."
              showSearch
              optionFilterProp="label"
              options={medications?.map((m) => ({
                value: m.id,
                label: `${m.genericName} (${m.strength})`,
              }))}
            />
          </Form.Item>
        )}

        <Form.Item
          name="batchNumber"
          label="Batch Number"
          rules={[{ required: true, message: "Please enter batch number" }]}
        >
          <Input placeholder="e.g. B-PARA-03" />
        </Form.Item>

        <Form.Item
          name="expiryDate"
          label="Expiry Date"
          rules={[{ required: true, message: "Please select expiry date" }]}
        >
          <DatePicker style={{ width: "100%" }} placeholder="Select Date" />
        </Form.Item>

        <Form.Item
          name="quantityOnHand"
          label="Quantity Received"
          rules={[
            { required: true, message: "Please enter quantity" },
            { type: "number", min: 0, message: "Quantity cannot be negative" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="reorderLevel"
          label="Reorder Level"
          rules={[
            { required: true, message: "Please enter reorder level" },
            { type: "number", min: 1, message: "Reorder level must be at least 1" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="unitCost"
          label="Unit Cost ($)"
          rules={[
            { required: true, message: "Please enter unit cost" },
            { type: "number", min: 0.01, message: "Unit cost must be positive" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} step={0.01} precision={2} />
        </Form.Item>

        <Form.Item name="supplier" label="Supplier">
          <Input placeholder="e.g. GlobalPharma" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
