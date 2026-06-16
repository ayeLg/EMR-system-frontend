"use client";

import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import { Alert, App, Checkbox, Modal, Table, Tag, Typography } from "antd";
import { dispensePrescription } from "../api/pharmacy-api";
import { INTERACTION_META } from "../constants";
import type { Prescription, RxItem } from "../types";

const { Text } = Typography;

export function DispenseModal({
  rx,
  open,
  onClose,
  onDispensed,
}: {
  rx: Prescription | null;
  open: boolean;
  onClose: () => void;
  onDispensed: (id: string) => void;
}) {
  const { message: messageApi } = App.useApp();
  const [coSign, setCoSign] = useState(false);
  const [ack, setAck] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flags = useMemo(() => {
    const sev = rx?.interactions.map((i) => i.severity) ?? [];
    return {
      contraindicated: sev.includes("CONTRAINDICATED"),
      severe: sev.includes("SEVERE"),
      moderate: sev.includes("MODERATE"),
    };
  }, [rx]);

  const blocked = flags.contraindicated;
  const needCoSign = flags.severe && !coSign;
  const needAck = flags.moderate && !ack;
  const needReason = (flags.severe || flags.moderate) && !overrideReason.trim();
  const canDispense = !blocked && !needCoSign && !needAck && !needReason && !submitting;

  const itemColumns: TableProps<RxItem>["columns"] = [
    { title: "Medication", dataIndex: "medication", key: "medication" },
    { title: "Dose", dataIndex: "dose", key: "dose" },
    { title: "Route", dataIndex: "route", key: "route" },
    { title: "Freq", dataIndex: "frequency", key: "frequency" },
    { title: "Qty", dataIndex: "quantityPrescribed", key: "quantityPrescribed" },
  ];

  const reset = () => {
    setCoSign(false);
    setAck(false);
    setOverrideReason("");
    setError(null);
  };

  return (
    <Modal
      open={open}
      title={rx ? `Dispense ${rx.rxNumber}` : "Dispense"}
      width={640}
      okText="Dispense"
      okButtonProps={{ disabled: !canDispense, loading: submitting }}
      onOk={async () => {
        if (!rx) return;
        setSubmitting(true);
        setError(null);
        try {
          await dispensePrescription(rx.id, {
            coSignObtained: coSign,
            ackModerate: ack,
            overrideReason: overrideReason || undefined,
          });
          messageApi.success(`${rx.rxNumber} dispensed. Stock deducted (FIFO).`);
          onDispensed(rx.id);
          reset();
        } catch (err) {
          const errorObj = err as {
            response?: { data?: { message?: string | string[] } };
            message?: string;
          };
          const msg =
            errorObj.response?.data?.message ||
            errorObj.message ||
            "Failed to dispense prescription";
          setError(Array.isArray(msg) ? msg.join(", ") : msg);
        } finally {
          setSubmitting(false);
        }
      }}
      onCancel={() => {
        reset();
        onClose();
      }}
    >
      {rx ? (
        <>
          <Text type="secondary">
            {rx.patientName} · {rx.mrn}
          </Text>
          <Table<RxItem>
            rowKey="medication"
            size="small"
            bordered
            style={{ margin: "12px 0" }}
            columns={itemColumns}
            dataSource={rx.items}
            pagination={false}
          />

          {error && (
            <Alert
              type="error"
              showIcon
              style={{ marginBottom: 12 }}
              title="Dispensing Error"
              description={error}
            />
          )}

          {rx.interactions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {rx.interactions.map((it) => {
                const meta = INTERACTION_META[it.severity];
                return (
                  <Alert
                    key={it.drugs}
                    type={meta.blocks ? "error" : "warning"}
                    showIcon
                    title={
                      <span>
                        <Tag color={meta.color}>{meta.label}</Tag> {it.drugs}
                      </span>
                    }
                    description={`${it.description} — ${meta.action}`}
                  />
                );
              })}
            </div>
          ) : (
            <Alert type="success" showIcon title="No drug interactions detected." />
          )}

          {flags.severe ? (
            <Checkbox
              checked={coSign}
              onChange={(e) => setCoSign(e.target.checked)}
              style={{ marginTop: 12 }}
            >
              Consultant co-sign obtained (required for severe interaction)
            </Checkbox>
          ) : null}
          {flags.moderate ? (
            <Checkbox
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
              style={{ marginTop: 12 }}
            >
              Acknowledge moderate interaction
            </Checkbox>
          ) : null}

          {(flags.severe || flags.moderate) && (
            <div style={{ marginTop: 12 }}>
              <Text strong style={{ display: "block", marginBottom: 4 }}>
                Override Reason (required)
              </Text>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Provide clinical reason for override..."
                style={{
                  width: "100%",
                  borderRadius: 6,
                  border: "1px solid #d9d9d9",
                  padding: "8px 12px",
                  outline: "none",
                  resize: "vertical",
                }}
                rows={2}
              />
            </div>
          )}

          {blocked ? (
            <Alert
              type="error"
              showIcon
              style={{ marginTop: 12 }}
              title="Contraindicated — dispensing blocked. Doctor must change the drug."
            />
          ) : null}
        </>
      ) : null}
    </Modal>
  );
}
