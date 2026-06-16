"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Card, Col, Form, Input, InputNumber, Row, Select, Typography } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useInpatients } from "@/features/ipd/hooks/useIpd";
import { useCreateClinicalDoc } from "./hooks/useClinicalDocs";

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
  const router = useRouter();
  const [form] = Form.useForm();
  
  const [values, setValues] = useState<Record<string, string | number>>({});
  const [selectedEncounterId, setSelectedEncounterId] = useState<string>("");

  // Load admitted inpatients
  const { data: inpatients = [], isLoading: loadingInpatients } = useInpatients();

  // Create document mutation
  const createDocMutation = useCreateClinicalDoc();

  const handleFieldChange = (name: string, val: string | number) => {
    setValues((p) => ({ ...p, [name]: val }));
  };

  const handlePatientSelect = (encounterId: string) => {
    setSelectedEncounterId(encounterId);
    const inpatient = inpatients.find((ip) => ip.id === encounterId);
    if (inpatient) {
      handleFieldChange("patient", inpatient.patientName);
      form.setFieldsValue({ patient: inpatient.patientName });
    }
  };

  const handleGenerate = () => {
    if (!selectedEncounterId) {
      message.error("Please select a patient before generating the document.");
      return;
    }

    // Map title to DB noteType
    let noteType: "REFERRAL" | "CERTIFICATE" | "DISCHARGE" = "REFERRAL";
    if (docTitle.toLowerCase().includes("certificate")) {
      noteType = "CERTIFICATE";
    } else if (docTitle.toLowerCase().includes("discharge")) {
      noteType = "DISCHARGE";
    }

    createDocMutation.mutate(
      {
        encounterId: selectedEncounterId,
        noteType,
        content: values,
      },
      {
        onSuccess: (res) => {
          message.success(`${docTitle} generated successfully.`);
          // Redirect to print preview
          router.push(`/print-previews?type=clinical-doc&id=${res.id}`);
        },
        onError: (err: unknown) => {
          const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
          const errMsg = errorObj?.response?.data?.message || errorObj?.message || "Failed to generate document";
          message.error(errMsg);
        },
      },
    );
  };

  return (
    <Row gutter={16}>
      <Col xs={24} md={11}>
        <Card size="small" title={`${docTitle} — details`}>
          <Form form={form} layout="vertical">
            {fields.map((f) => {
              if (f.name === "patient") {
                return (
                  <Form.Item key={f.name} label="Patient" style={{ marginBottom: 12 }} required>
                    <Select
                      placeholder="Select admitted patient..."
                      loading={loadingInpatients}
                      onChange={handlePatientSelect}
                      options={inpatients.map((ip) => ({
                        label: `${ip.patientName} (${ip.mrn})`,
                        value: ip.id, // encounterId
                      }))}
                    />
                  </Form.Item>
                );
              }

              return (
                <Form.Item key={f.name} label={f.label} style={{ marginBottom: 12 }}>
                  {f.type === "textarea" ? (
                    <Input.TextArea
                      rows={3}
                      onChange={(e) => handleFieldChange(f.name, e.target.value)}
                    />
                  ) : f.type === "number" ? (
                    <InputNumber
                      style={{ width: "100%" }}
                      onChange={(v) => handleFieldChange(f.name, v ?? 0)}
                    />
                  ) : (
                    <Input onChange={(e) => handleFieldChange(f.name, e.target.value)} />
                  )}
                </Form.Item>
              );
            })}
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              loading={createDocMutation.isPending}
              onClick={handleGenerate}
              style={{ marginTop: 8 }}
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
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Title level={5} style={{ margin: 0, color: "#1a3c6b" }}>
              EMR Hospital
            </Title>
            <Text style={{ color: "#666" }}>No. 1, Pyay Road, Yangon · 01-555000</Text>
            <Title level={4} style={{ marginTop: 12, color: "#1e1e1e" }}>
              {docTitle}
            </Title>
          </div>
          {fields.map((f) => (
            <div key={f.name} style={{ marginBottom: 10 }}>
              <Text strong style={{ color: "#1e1e1e" }}>
                {f.label}:{" "}
              </Text>
              <Text style={{ color: "#333", whiteSpace: "pre-line" }}>
                {values[f.name] || "—"}
              </Text>
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
