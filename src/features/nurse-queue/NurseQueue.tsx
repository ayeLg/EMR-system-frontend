"use client";

import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import { App, Button, Col, Form, Input, InputNumber, Modal, Row, Statistic } from "antd";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import {
  useNurseQueueAppointments,
  useRecordAppointmentVitals,
} from "@/features/appointments/hooks/useAppointments";
import type { RecordVitalsPayload } from "@/features/appointments/api/appointments-api";
import type { Appointment } from "@/features/appointments/types";

type VitalsFormValues = Omit<RecordVitalsPayload, "bmi">;

export function NurseQueue() {
  const { data, isLoading } = useNurseQueueAppointments();
  const recordVitals = useRecordAppointmentVitals();
  const { message } = App.useApp();
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [form] = Form.useForm<VitalsFormValues>();
  const [bmi, setBmi] = useState<number | null>(null);
  const requiredRule = { required: true, message: "Required" };

  const queue = useMemo(
    () =>
      (data ?? [])
        .filter((appointment) => !done.includes(appointment.id))
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),
    [data, done],
  );

  const resetModal = () => {
    setSelected(null);
    form.resetFields();
    setBmi(null);
  };

  const recalcBmi = () => {
    const weightKg = form.getFieldValue("weightKg");
    const heightCm = form.getFieldValue("heightCm");
    if (weightKg && heightCm) {
      setBmi(Number((weightKg / (heightCm / 100) ** 2).toFixed(1)));
    } else {
      setBmi(null);
    }
  };

  const columns: TableProps<Appointment>["columns"] = [
    { title: "No.", dataIndex: "appointmentNo", key: "appointmentNo" },
    {
      title: "Patient",
      key: "patient",
      render: (_, record) => `${record.patientName} - ${record.mrn}`,
    },
    { title: "Doctor", dataIndex: "doctorName", key: "doctor" },
    { title: "Scheduled", dataIndex: "scheduledAt", key: "scheduledAt" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => setSelected(record)}>
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
        title={selected ? `Vitals - ${selected.patientName}` : "Vitals"}
        okText="Save & mark ready"
        confirmLoading={recordVitals.isPending}
        onCancel={resetModal}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={recalcBmi}
          onFinish={async (values) => {
            if (!selected) return;
            const calculatedBmi = Number(
              (values.weightKg / (values.heightCm / 100) ** 2).toFixed(1),
            );
            try {
              await recordVitals.mutateAsync({
                id: selected.id,
                payload: { ...values, bmi: calculatedBmi },
              });
              setDone((previous) => [...previous, selected.id]);
              message.success(
                `Vitals saved - ${selected.appointmentNo} -> IN_PROGRESS`,
              );
              resetModal();
            } catch {
              message.error("Unable to record vitals");
            }
          }}
        >
          <Row gutter={12}>
            <Col xs={12} md={6}>
              <Form.Item name="systolicBp" label="Systolic" rules={[requiredRule]}>
                <InputNumber min={0} max={300} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="diastolicBp" label="Diastolic" rules={[requiredRule]}>
                <InputNumber min={0} max={200} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="heartRate" label="HR" rules={[requiredRule]}>
                <InputNumber min={0} max={300} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="respiratoryRate" label="RR" rules={[requiredRule]}>
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="temperature" label="Temp C" rules={[requiredRule]}>
                <InputNumber min={25} max={45} step={0.1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="oxygenSaturation" label="SpO2 %" rules={[requiredRule]}>
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="weightKg" label="Weight kg" rules={[requiredRule]}>
                <InputNumber min={0.1} max={400} step={0.1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="heightCm" label="Height cm" rules={[requiredRule]}>
                <InputNumber min={0.1} max={300} step={0.1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item name="painScore" label="Pain (0-10)" rules={[requiredRule]}>
                <InputNumber min={0} max={10} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={12}>
              <Form.Item name="bloodGlucose" label="Glucose mg/dL">
                <InputNumber min={0} max={2000} step={0.1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item label="BMI (auto)">
                <Statistic
                  value={bmi ?? "-"}
                  styles={{ content: { fontSize: 20 } }}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="notes" label="Notes">
                <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
