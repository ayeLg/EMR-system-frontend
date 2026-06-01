"use client";

import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import { Alert, App, Checkbox, Modal, Table, Tag, Typography } from "antd";
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
  const { message } = App.useApp();
  const [coSign, setCoSign] = useState(false);
  const [ack, setAck] = useState(false);

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
  const canDispense = !blocked && !needCoSign && !needAck;

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
  };

  return (
    <Modal
      open={open}
      title={rx ? `Dispense ${rx.rxNumber}` : "Dispense"}
      width={640}
      okText="Dispense"
      okButtonProps={{ disabled: !canDispense }}
      onOk={() => {
        if (!rx) return;
        onDispensed(rx.id);
        message.success(`${rx.rxNumber} dispensed. Stock deducted (FIFO).`);
        reset();
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
