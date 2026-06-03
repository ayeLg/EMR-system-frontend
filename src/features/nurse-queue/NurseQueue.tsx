"use client";

import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import { App, Button, Col, Form, InputNumber, Modal, Row, Statistic } from "antd";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import type { Appointment } from "@/features/appointments/types";

export function NurseQueue() {
  const { data, isLoading } = useAppointments();
  const { message } = App.useApp();
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [bmi, setBmi] = useState<number | null>(null);

  // ARRIVED queue, earliest scheduled first.
  const queue = useMemo(
    () =>
      (data ?? [])
        .filter((a) => a.status === "ARRIVED" && !done.includes(a.id))
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),
    [data, done],
  );

  const recalcBmi = () => {
    const w = form.getFieldValue("weightKg");
    const h = form.getFieldValue("heightCm");
    if (w && h) setBmi(Number((w / (h / 100) ** 2).toFixed(1)));
    else setBmi(null);
  };

  const columns: TableProps<Appointment>["columns"] = [
    { title: "No.", dataIndex: "appointmentNo", key: "appointmentNo" },
    { title: "Patient", key: "patient", render: (_, r) => `${r.patientName} · ${r.mrn}` },
    { title: "Doctor", dataIndex: "doctorName", key: "doctor" },
    { title: "Scheduled", dataIndex: "scheduledAt", key: "scheduledAt" },
    {
      title: "Action",
      key: "action",
      render: (_, r) => (
        <Button type="primary" size="small" onClick={() => setSelected(r)}>
          Record vitals
        </Button>
      ),
    },
  ];

  return (
    <>
      <ContentCard>
        <DataTable<Appointment>
          rowKey="id"
          columns={columns}
          dataSource={queue}
          loading={isLoading}
          locale={{ emptyText: "No patients waiting (ARRIVED)" }}
        />
      </ContentCard>

      <Modal
        open={!!selected}
        title={selected ? `Vitals — ${selected.patientName}` : "Vitals"}
        okText="Save & mark ready"
        onCancel={() => {
          setSelected(null);
          form.resetFields();
          setBmi(null);
        }}
        onOk={() => {
          if (!selected) return;
          setDone((p) => [...p, selected.id]);
          message.success(
            `Vitals saved · ${selected.appointmentNo} → IN_PROGRESS · doctor notified (patient ready)`,
          );
          setSelected(null);
          form.resetFields();
          setBmi(null);
        }}
      >
        <Form form={form} layout="vertical" onValuesChange={recalcBmi}>
          <Row gutter={12}>
            <Col xs={12} md={6}><Form.Item name="systolicBp" label="Systolic"><InputNumber style={{ width: "100%" }} /></Form.Item></Col>
            <Col xs={12} md={6}><Form.Item name="diastolicBp" label="Diastolic"><InputNumber style={{ width: "100%" }} /></Form.Item></Col>
            <Col xs={12} md={6}><Form.Item name="heartRate" label="HR"><InputNumber style={{ width: "100%" }} /></Form.Item></Col>
            <Col xs={12} md={6}><Form.Item name="respiratoryRate" label="RR"><InputNumber style={{ width: "100%" }} /></Form.Item></Col>
            <Col xs={12} md={6}><Form.Item name="temperature" label="Temp °C"><InputNumber step={0.1} style={{ width: "100%" }} /></Form.Item></Col>
            <Col xs={12} md={6}><Form.Item name="oxygenSaturation" label="SpO₂ %"><InputNumber style={{ width: "100%" }} /></Form.Item></Col>
            <Col xs={12} md={6}><Form.Item name="weightKg" label="Weight kg"><InputNumber step={0.1} style={{ width: "100%" }} /></Form.Item></Col>
            <Col xs={12} md={6}><Form.Item name="heightCm" label="Height cm"><InputNumber step={0.1} style={{ width: "100%" }} /></Form.Item></Col>
            <Col xs={12} md={6}><Form.Item name="painScore" label="Pain (0-10)"><InputNumber min={0} max={10} style={{ width: "100%" }} /></Form.Item></Col>
            <Col xs={12} md={6}>
              <Form.Item label="BMI (auto)">
                <Statistic value={bmi ?? "—"} valueStyle={{ fontSize: 20 }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
