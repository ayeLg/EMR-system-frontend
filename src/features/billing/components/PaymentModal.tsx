"use client";

import { useState } from "react";
import { Form, InputNumber, Modal, Select } from "antd";
import { PAYMENT_METHOD_OPTIONS } from "../constants";
import type { PaymentMethod } from "../types";

export function PaymentModal({
  open,
  outstanding,
  onClose,
  onRecord,
}: {
  open: boolean;
  outstanding: number;
  onClose: () => void;
  onRecord: (amount: number, method: PaymentMethod) => void;
}) {
  const [amount, setAmount] = useState<number | null>(outstanding);
  const [method, setMethod] = useState<PaymentMethod>("CASH");

  return (
    <Modal
      open={open}
      title="Record payment"
      okText="Record"
      okButtonProps={{ disabled: !amount || amount <= 0 }}
      onOk={() => {
        if (amount && amount > 0) onRecord(amount, method);
      }}
      onCancel={onClose}
    >
      <Form layout="vertical">
        <Form.Item label="Amount (Ks)">
          <InputNumber
            value={amount}
            onChange={(v) => setAmount(v == null ? null : Number(v))}
            style={{ width: "100%" }}
            min={0}
          />
        </Form.Item>
        <Form.Item label="Method">
          <Select
            value={method}
            onChange={(v) => setMethod(v as PaymentMethod)}
            options={PAYMENT_METHOD_OPTIONS}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
