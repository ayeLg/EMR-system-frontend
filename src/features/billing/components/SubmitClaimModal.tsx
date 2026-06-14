import { useState } from "react";
import { Form, Input, Modal } from "antd";

interface SubmitClaimModalProps {
  readonly open: boolean;
  readonly loading: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (insuranceProvider: string, policyNumber: string) => void;
}

export function SubmitClaimModal({
  open,
  loading,
  onClose,
  onSubmit,
}: Readonly<SubmitClaimModalProps>) {
  const [provider, setProvider] = useState("");
  const [policyNo, setPolicyNo] = useState("");
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    setProvider("");
    setPolicyNo("");
  }

  return (
    <Modal
      open={open}
      title="Submit Insurance Claim"
      okText="Submit Claim"
      confirmLoading={loading}
      okButtonProps={{ disabled: !provider.trim() || !policyNo.trim() || loading }}
      onOk={() => {
        if (provider.trim() && policyNo.trim()) {
          onSubmit(provider.trim(), policyNo.trim());
        }
      }}
      onCancel={onClose}
    >
      <Form layout="vertical">
        <Form.Item label="Insurance Provider" required>
          <Input
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="e.g. Blue Cross, Prudential"
            disabled={loading}
          />
        </Form.Item>
        <Form.Item label="Policy Number" required>
          <Input
            value={policyNo}
            onChange={(e) => setPolicyNo(e.target.value)}
            placeholder="e.g. POL-1234567"
            disabled={loading}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
