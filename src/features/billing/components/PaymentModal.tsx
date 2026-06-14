import { useState } from "react";
import { Form, Input, InputNumber, Modal, Select } from "antd";
import { PAYMENT_METHOD_OPTIONS } from "../constants";
import type { PaymentMethod } from "../types";

export function PaymentModal({
  open,
  outstanding,
  loading,
  onClose,
  onRecord,
}: Readonly<{
  open: boolean;
  outstanding: number;
  loading: boolean;
  onClose: () => void;
  onRecord: (
    amount: number,
    method: PaymentMethod,
    referenceNo?: string,
    notes?: string
  ) => void;
}>) {
  const [amount, setAmount] = useState<number | null>(outstanding);
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [referenceNo, setReferenceNo] = useState("");
  const [notes, setNotes] = useState("");

  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    setAmount(outstanding);
    setMethod("CASH");
    setReferenceNo("");
    setNotes("");
  }

  return (
    <Modal
      open={open}
      title="Record Payment"
      okText="Record"
      confirmLoading={loading}
      okButtonProps={{ disabled: !amount || amount <= 0 || loading }}
      onOk={() => {
        if (amount && amount > 0) {
          onRecord(amount, method, referenceNo || undefined, notes || undefined);
        }
      }}
      onCancel={onClose}
    >
      <Form layout="vertical">
        <Form.Item label="Amount (Ks)" required>
          <InputNumber
            value={amount}
            onChange={(v) => setAmount(v == null ? null : Number(v))}
            style={{ width: "100%" }}
            min={0}
            disabled={loading}
          />
        </Form.Item>
        <Form.Item label="Method" required>
          <Select
            value={method}
            onChange={(v) => setMethod(v as PaymentMethod)}
            options={PAYMENT_METHOD_OPTIONS}
            style={{ width: "100%" }}
            disabled={loading}
          />
        </Form.Item>
        <Form.Item label="Reference No. (optional)">
          <Input
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
            placeholder="e.g. Txn ID, Card Slip No"
            disabled={loading}
          />
        </Form.Item>
        <Form.Item label="Notes (optional)">
          <Input.TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional comments..."
            rows={3}
            disabled={loading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

