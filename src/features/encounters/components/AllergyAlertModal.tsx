"use client";

import { useState } from "react";
import { Alert, Input, Modal, Typography } from "antd";

const { Text } = Typography;

interface AllergyAlertModalProps {
  open: boolean;
  drug: string;
  allergen: string;
  onOverride: (reason: string) => void;
  onCancel: () => void;
}

export function AllergyAlertModal({
  open,
  drug,
  allergen,
  onOverride,
  onCancel,
}: AllergyAlertModalProps) {
  const [reason, setReason] = useState("");

  return (
    <Modal
      open={open}
      title={<Text type="danger">⛔ Drug allergy alert</Text>}
      okText="Override & prescribe"
      okButtonProps={{ danger: true, disabled: reason.trim().length < 5 }}
      cancelText="Change drug"
      onOk={() => {
        onOverride(reason);
        setReason("");
      }}
      onCancel={() => {
        setReason("");
        onCancel();
      }}
    >
      <Alert
        type="error"
        showIcon
        title={`${drug} conflicts with a recorded allergy: ${allergen}`}
        description="Prescribing is blocked. An override requires a documented reason (audit-logged)."
        style={{ marginBottom: 12 }}
      />
      <Input.TextArea
        rows={3}
        placeholder="Override reason (required, min 5 chars)…"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </Modal>
  );
}
