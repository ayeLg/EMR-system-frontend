"use client";

import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import {
  App,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Progress,
  Row,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { CreateButton } from "@/components/ui/CreateButton";
import { usePatients } from "@/features/patients/hooks/usePatients";
import { useStaff } from "@/features/users/hooks/useStaff";
import {
  useWardOccupancy,
  useInpatients,
  useAdmitPatient,
  useDischargePatient,
  useCreateProgressNote,
} from "./hooks/useIpd";
import type { Inpatient } from "./types";

export function IpdBoard() {
  const { message } = App.useApp();
  const { data: wards = [], isLoading: loadingWards } = useWardOccupancy();
  const { data: inpatients = [], isLoading: loadingInpatients } = useInpatients();

  const admitMutation = useAdmitPatient();
  const dischargeMutation = useDischargePatient();
  const progressNoteMutation = useCreateProgressNote();

  const { data: patients = [], isLoading: loadingPatients } = usePatients();
  const { data: staff = [], isLoading: loadingStaff } = useStaff();

  // Modals state
  const [admitModalOpen, setAdmitModalOpen] = useState(false);
  const [dischargeTarget, setDischargeTarget] = useState<Inpatient | null>(null);
  const [noteTarget, setNoteTarget] = useState<Inpatient | null>(null);

  // Forms
  const [admitForm] = Form.useForm();
  const [dischargeForm] = Form.useForm();
  const [noteForm] = Form.useForm();

  // Selected ward in admission form to filter beds
  const [selectedWardId, setSelectedWardId] = useState<string | undefined>(undefined);

  // Option list memos
  const patientOptions = useMemo(
    () =>
      patients
        .filter((p) => p.status === "ACTIVE")
        .map((p) => ({
          label: `${p.fullName} (${p.mrn})`,
          value: p.id,
        })),
    [patients],
  );

  const doctorOptions = useMemo(
    () =>
      staff
        .filter((u) => u.status === "ACTIVE")
        .filter((u) => u.role.toLowerCase().includes("doctor"))
        .map((doctor) => ({
          label: doctor.fullName,
          value: doctor.id,
        })),
    [staff],
  );

  const wardOptions = useMemo(
    () =>
      wards.map((w) => ({
        label: w.name,
        value: w.id,
      })),
    [wards],
  );

  const bedOptions = useMemo(() => {
    if (!selectedWardId) return [];
    const ward = wards.find((w) => w.id === selectedWardId);
    if (!ward) return [];

    const getBedPrefix = (code?: string) => {
      if (!code) return "B-";
      const c = code.toUpperCase();
      if (c.includes("WARD-A")) return "A-";
      if (c.includes("ICU")) return "ICU-";
      if (c.includes("PEDS") || c.includes("PEDIATRIC") || c.includes("PEDS-W")) return "P-";
      return `${c.substring(0, 5)}-`;
    };

    const prefix = getBedPrefix(ward?.code);
    const totalBeds = ward.totalBeds;
    const occupied = new Set(ward.occupiedBedsList);

    // Generate list of all beds
    const allBeds = Array.from({ length: totalBeds }, (_, i) => {
      const numStr = String(i + 1).padStart(2, "0");
      // Match seed conventions
      let bedCode = `${prefix}${numStr}`;
      if (ward.name.includes("Ward A")) bedCode = `A-${numStr}`;
      if (ward.name.includes("ICU")) bedCode = `ICU-${numStr}`;
      if (ward.name.includes("Pediatric")) bedCode = `P-${numStr}`;
      return bedCode;
    });

    return allBeds.map((bed) => ({
      label: bed,
      value: bed,
      disabled: occupied.has(bed),
    }));
  }, [selectedWardId, wards]);

interface AdmitFormValues {
  patientId: string;
  wardId: string;
  bedNumber: string;
  admissionDate: dayjs.Dayjs;
  attendingDoctorId: string;
  diagnosis: string;
  icd10Code?: string;
}

interface DischargeFormValues {
  dischargeSummary: string;
  dischargeDate: dayjs.Dayjs;
}

interface NoteFormValues {
  content: string;
}

  const handleAdmitSubmit = async (values: AdmitFormValues) => {
    try {
      await admitMutation.mutateAsync({
        patientId: values.patientId,
        wardId: values.wardId,
        bedNumber: values.bedNumber,
        admissionDate: values.admissionDate.toISOString(),
        attendingDoctorId: values.attendingDoctorId,
        diagnosis: values.diagnosis,
        icd10Code: values.icd10Code || undefined,
      });
      message.success("Patient successfully admitted.");
      setAdmitModalOpen(false);
      admitForm.resetFields();
      setSelectedWardId(undefined);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      message.error(apiErr.message || "Unable to admit patient.");
    }
  };

  const handleDischargeSubmit = async (values: DischargeFormValues) => {
    if (!dischargeTarget) return;
    try {
      await dischargeMutation.mutateAsync({
        id: dischargeTarget.id,
        payload: {
          dischargeSummary: values.dischargeSummary,
          dischargeDate: values.dischargeDate.toISOString(),
        },
      });
      message.success(`${dischargeTarget.patientName} discharged. Final invoice generated.`);
      setDischargeTarget(null);
      dischargeForm.resetFields();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      message.error(apiErr.message || "Failed to discharge patient.");
    }
  };

  const handleNoteSubmit = async (values: NoteFormValues) => {
    if (!noteTarget) return;
    try {
      await progressNoteMutation.mutateAsync({
        id: noteTarget.id,
        payload: {
          content: values.content,
        },
      });
      message.success("Progress note saved.");
      setNoteTarget(null);
      noteForm.resetFields();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      message.error(apiErr.message || "Failed to save progress note.");
    }
  };

  const columns: TableProps<Inpatient>["columns"] = [
    { title: "Patient", key: "patient", render: (_, r) => `${r.patientName} (${r.mrn})` },
    { title: "Ward / Bed", key: "ward", render: (_, r) => `${r.ward} · Bed ${r.bed}` },
    { title: "Admitted", dataIndex: "admittedAt", key: "admittedAt" },
    { title: "Diagnosis", dataIndex: "diagnosis", key: "diagnosis" },
    { title: "Attending Doctor", dataIndex: "attendingDoctorName", key: "doctor" },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) => (
        <Space>
          <Button size="small" onClick={() => setNoteTarget(r)}>
            Progress note
          </Button>
          <Button size="small" danger onClick={() => setDischargeTarget(r)}>
            Discharge
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* Ward Occupancy Progress Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {wards.map((w) => {
          const free = w.totalBeds - w.occupiedBeds;
          const pct = Math.round((w.occupiedBeds / w.totalBeds) * 100) || 0;
          return (
            <Col xs={24} md={8} key={w.id}>
              <Card size="small" title={w.name} loading={loadingWards}>
                <Progress percent={pct} status={pct >= 90 ? "exception" : "active"} />
                <div style={{ marginTop: 8, color: "var(--emr-text-muted)" }}>
                  {w.occupiedBeds}/{w.totalBeds} occupied · {free} free
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Inpatients Data Table */}
      <ContentCard
        toolbar={
          <PageToolbar
            actions={
              <CreateButton onClick={() => setAdmitModalOpen(true)}>
                Admit patient
              </CreateButton>
            }
          />
        }
      >
        <DataTable<Inpatient>
          rowKey="id"
          columns={columns}
          dataSource={inpatients}
          loading={loadingInpatients}
          locale={{ emptyText: "No active patients in wards" }}
        />
      </ContentCard>

      {/* Admit Patient Modal */}
      <Modal
        open={admitModalOpen}
        title="Admit Patient"
        okText="Admit"
        confirmLoading={admitMutation.isPending}
        onCancel={() => {
          setAdmitModalOpen(false);
          admitForm.resetFields();
          setSelectedWardId(undefined);
        }}
        onOk={() => admitForm.submit()}
      >
        <Form
          form={admitForm}
          layout="vertical"
          initialValues={{ admissionDate: dayjs() }}
          onFinish={handleAdmitSubmit}
        >
          <Form.Item
            name="patientId"
            label="Patient"
            rules={[{ required: true, message: "Please select a patient" }]}
          >
            <Select
              showSearch
              placeholder="Select patient"
              options={patientOptions}
              loading={loadingPatients}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="attendingDoctorId"
            label="Attending Doctor"
            rules={[{ required: true, message: "Please select an attending doctor" }]}
          >
            <Select
              showSearch
              placeholder="Select doctor"
              options={doctorOptions}
              loading={loadingStaff}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="wardId"
                label="Ward"
                rules={[{ required: true, message: "Please select a ward" }]}
              >
                <Select
                  placeholder="Select ward"
                  options={wardOptions}
                  onChange={(v) => {
                    setSelectedWardId(v);
                    admitForm.setFieldValue("bedNumber", undefined);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bedNumber"
                label="Bed"
                rules={[{ required: true, message: "Please select a bed" }]}
              >
                <Select
                  placeholder="Select bed"
                  disabled={!selectedWardId}
                  options={bedOptions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="admissionDate"
            label="Admission Date"
            rules={[{ required: true, message: "Please select admission date" }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="diagnosis"
            label="Admitting Diagnosis"
            rules={[{ required: true, message: "Please input diagnosis description" }]}
          >
            <Input.TextArea rows={3} placeholder="Initial assessment diagnosis..." />
          </Form.Item>

          <Form.Item name="icd10Code" label="ICD-10 Code (Optional)">
            <Input placeholder="e.g. J18.9" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Discharge Patient Modal */}
      <Modal
        open={!!dischargeTarget}
        title={dischargeTarget ? `Discharge Inpatient — ${dischargeTarget.patientName}` : "Discharge"}
        okText="Discharge"
        okButtonProps={{ danger: true }}
        confirmLoading={dischargeMutation.isPending}
        onCancel={() => {
          setDischargeTarget(null);
          dischargeForm.resetFields();
        }}
        onOk={() => dischargeForm.submit()}
      >
        <Form
          form={dischargeForm}
          layout="vertical"
          initialValues={{ dischargeDate: dayjs() }}
          onFinish={handleDischargeSubmit}
        >
          <Form.Item
            name="dischargeDate"
            label="Discharge Date"
            rules={[{ required: true, message: "Please select discharge date" }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="dischargeSummary"
            label="Discharge Summary"
            rules={[
              { required: true, message: "Please write a discharge summary" },
              { min: 10, message: "Summary must be at least 10 characters" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Summary of treatment and outcome..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Daily Progress Note Modal */}
      <Modal
        open={!!noteTarget}
        title={noteTarget ? `Daily progress note — ${noteTarget.patientName}` : "Progress note"}
        okText="Save note"
        confirmLoading={progressNoteMutation.isPending}
        onCancel={() => {
          setNoteTarget(null);
          noteForm.resetFields();
        }}
        onOk={() => noteForm.submit()}
      >
        <Form form={noteForm} layout="vertical" onFinish={handleNoteSubmit}>
          <Form.Item
            name="content"
            label="Progress Note Content"
            rules={[{ required: true, message: "Please write progress notes" }]}
          >
            <Input.TextArea rows={4} placeholder="Subjective / objective / plan for today…" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
