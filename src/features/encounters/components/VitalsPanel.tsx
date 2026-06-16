"use client";

import { App, Button, Card, Col, Form, Input, InputNumber, Row, Statistic } from "antd";
import { useRecordEncounterVitals } from "../hooks/useEncounters";
import type { VitalsValues } from "../schemas";
import type { Vitals } from "../types";

const STAT_DEFS: { key: keyof Vitals; title: string; suffix?: string }[] = [
  { key: "systolicBp", title: "Systolic BP", suffix: "mmHg" },
  { key: "diastolicBp", title: "Diastolic BP", suffix: "mmHg" },
  { key: "heartRate", title: "Heart rate", suffix: "bpm" },
  { key: "respiratoryRate", title: "Resp rate", suffix: "/min" },
  { key: "temperature", title: "Temp", suffix: "C" },
  { key: "oxygenSaturation", title: "SpO2", suffix: "%" },
  { key: "weightKg", title: "Weight", suffix: "kg" },
  { key: "heightCm", title: "Height", suffix: "cm" },
  { key: "bmi", title: "BMI", suffix: "kg/m2" },
  { key: "painScore", title: "Pain", suffix: "/10" },
  { key: "bloodGlucose", title: "Glucose", suffix: "mg/dL" },
];

export function VitalsPanel({
  encounterId,
  vitals,
  readOnly = false,
}: {
  encounterId: string;
  vitals?: Vitals & { recordedAt: string };
  readOnly?: boolean;
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

      {readOnly ? null : (
      <Card size="small" title="Record vitals">
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values: VitalsValues) => {
            // BMI auto-calculated from weight + height (not user-entered).
            const { weightKg, heightCm } = values;
            const bmi =
              weightKg && heightCm
                ? Math.round((weightKg / (heightCm / 100) ** 2) * 10) / 10
                : undefined;
            try {
              await recordVitals.mutateAsync({ ...values, bmi });
              message.success("Vitals recorded.");
              form.resetFields();
            } catch (err) {
              const apiErr = err as { message?: string };
              message.error(apiErr.message ?? "Failed to record vitals");
            }
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
              <Form.Item name="respiratoryRate" label="RR">
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
              <Form.Item name="weightKg" label="Weight (kg)">
                <InputNumber style={{ width: "100%" }} step={0.1} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item name="heightCm" label="Height (cm)">
                <InputNumber style={{ width: "100%" }} step={0.1} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item name="painScore" label="Pain (0-10)">
                <InputNumber style={{ width: "100%" }} min={0} max={10} />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item name="bloodGlucose" label="Glucose (mg/dL)">
                <InputNumber style={{ width: "100%" }} step={0.1} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="notes" label="Notes">
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
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
      )}
    </>
  );
}
