"use client";

import { App, Button, Card, Col, Form, InputNumber, Row, Statistic } from "antd";
import { useRecordEncounterVitals } from "../hooks/useEncounters";
import type { VitalsValues } from "../schemas";
import type { Vitals } from "../types";

const STAT_DEFS: { key: keyof Vitals; title: string; suffix?: string }[] = [
  { key: "systolicBp", title: "Systolic BP", suffix: "mmHg" },
  { key: "diastolicBp", title: "Diastolic BP", suffix: "mmHg" },
  { key: "heartRate", title: "Heart rate", suffix: "bpm" },
  { key: "temperature", title: "Temp", suffix: "C" },
  { key: "oxygenSaturation", title: "SpO2", suffix: "%" },
  { key: "weightKg", title: "Weight", suffix: "kg" },
];

export function VitalsPanel({
  encounterId,
  vitals,
}: {
  encounterId: string;
  vitals?: Vitals & { recordedAt: string };
}) {
  const { message } = App.useApp();
  const recordVitals = useRecordEncounterVitals(encounterId);
  const [form] = Form.useForm();

  return (
    <>
      <Card
        size="small"
        title={`Latest vitals${vitals ? ` - ${vitals.recordedAt}` : ""}`}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[16, 16]}>
          {STAT_DEFS.map((s) => (
            <Col xs={12} md={4} key={s.key}>
              <Statistic
                title={s.title}
                value={vitals?.[s.key] ?? "-"}
                suffix={vitals?.[s.key] != null ? s.suffix : undefined}
              />
            </Col>
          ))}
        </Row>
      </Card>

      <Card size="small" title="Record vitals">
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values: VitalsValues) => {
            await recordVitals.mutateAsync(values);
            message.success("Vitals recorded.");
            form.resetFields();
          }}
        >
          <Row gutter={16}>
            <Col xs={12} md={4}>
              <Form.Item name="systolicBp" label="Systolic">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item name="diastolicBp" label="Diastolic">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item name="heartRate" label="HR">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item name="temperature" label="Temp">
                <InputNumber style={{ width: "100%" }} step={0.1} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item name="oxygenSaturation" label="SpO2">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item name="weightKg" label="Weight">
                <InputNumber style={{ width: "100%" }} step={0.1} />
              </Form.Item>
            </Col>
          </Row>
          <Button
            type="primary"
            htmlType="submit"
            loading={recordVitals.isPending}
          >
            Record
          </Button>
        </Form>
      </Card>
    </>
  );
}
