import { useState } from "react";
import { Form, Input, Modal } from "antd";

interface VoidInvoiceModalProps {
  readonly open: boolean;
  readonly loading: boolean;
  readonly onClose: () => void;
  readonly onVoid: (reason: string) => void;
}

export function VoidInvoiceModal({
  open,
  loading,
  onClose,
  onVoid,
}: Readonly<VoidInvoiceModalProps>) {
  const [reason, setReason] = useState("");
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    setReason("");
  }

  const isValid = reason.trim().length >= 5;

  return (
    <Modal
      open={open}
      title="Void Invoice"
      okText="Void"
      okButtonProps={{ danger: true, disabled: !isValid || loading }}
      confirmLoading={loading}
      onOk={() => {
        if (isValid) {
          onVoid(reason.trim());
        }
      }}
      onCancel={onClose}
    >
      <Form layout="vertical">
        <Form.Item
          label="Reason for Voiding"
          required
          help={!isValid && reason.length > 0 ? "Reason must be at least 5 characters." : undefined}
          validateStatus={!isValid && reason.length > 0 ? "error" : undefined}
        >
          <Input.TextArea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the reason (minimum 5 characters, will be logged to audit)..."
            rows={3}
            disabled={loading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
