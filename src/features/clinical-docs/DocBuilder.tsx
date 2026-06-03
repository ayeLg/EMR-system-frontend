"use client";

import { useState } from "react";
import { App, Button, Card, Col, Form, Input, InputNumber, Row, Typography } from "antd";
import { PrinterOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export interface DocField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number";
}

export function DocBuilder({
  docTitle,
  fields,
}: {
  docTitle: string;
  fields: DocField[];
}) {
  const { message } = App.useApp();
  const [values, setValues] = useState<Record<string, string | number>>({});

  const set = (name: string, v: string | number) =>
    setValues((p) => ({ ...p, [name]: v }));

  return (
    <Row gutter={16}>
      <Col xs={24} md={11}>
        <Card size="small" title={`${docTitle} — details`}>
          <Form layout="vertical">
            {fields.map((f) => (
              <Form.Item key={f.name} label={f.label} style={{ marginBottom: 12 }}>
                {f.type === "textarea" ? (
                  <Input.TextArea rows={3} onChange={(e) => set(f.name, e.target.value)} />
                ) : f.type === "number" ? (
                  <InputNumber style={{ width: "100%" }} onChange={(v) => set(f.name, v ?? 0)} />
                ) : (
                  <Input onChange={(e) => set(f.name, e.target.value)} />
                )}
              </Form.Item>
            ))}
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={() => message.success(`${docTitle} sent to printer (mock).`)}
            >
              Generate &amp; print
            </Button>
          </Form>
        </Card>
      </Col>

      <Col xs={24} md={13}>
        {/* Print-style preview */}
        <div
          style={{
            background: "#fff",
            color: "#1e1e1e",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 28,
            minHeight: 360,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Title level={5} style={{ margin: 0, color: "#1e1e1e" }}>
              Yangon EMR Hospital
            </Title>
            <Text style={{ color: "#666" }}>No. 1, Pyay Road, Yangon · 01-555000</Text>
            <Title level={4} style={{ marginTop: 12, color: "#1e1e1e" }}>
              {docTitle}
            </Title>
          </div>
          {fields.map((f) => (
            <div key={f.name} style={{ marginBottom: 10 }}>
              <Text strong style={{ color: "#1e1e1e" }}>{f.label}: </Text>
              <Text style={{ color: "#333" }}>{values[f.name] || "—"}</Text>
            </div>
          ))}
          <div style={{ marginTop: 40, textAlign: "right", color: "#666" }}>
            _______________________
            <br />
            Doctor&apos;s signature
          </div>
        </div>
      </Col>
    </Row>
  );
}
