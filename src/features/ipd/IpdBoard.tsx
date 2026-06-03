"use client";

import { useState } from "react";
import type { TableProps } from "antd";
import { App, Button, Card, Col, Input, Modal, Popconfirm, Progress, Row, Space } from "antd";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { CreateButton } from "@/components/ui/CreateButton";
import { WARD_SUMMARY, INPATIENTS, type Inpatient } from "./data";

export function IpdBoard() {
  const { message } = App.useApp();
  const [rows, setRows] = useState<Inpatient[]>(INPATIENTS);
  const [noteFor, setNoteFor] = useState<Inpatient | null>(null);
  const [note, setNote] = useState("");

  const discharge = (r: Inpatient) => {
    setRows((p) => p.filter((x) => x.id !== r.id));
    message.success(`${r.patientName} discharged (mock). Final invoice + pharmacy return check.`);
  };

  const columns: TableProps<Inpatient>["columns"] = [
    { title: "Patient", key: "patient", render: (_, r) => `${r.patientName} · ${r.mrn}` },
    { title: "Ward / Bed", key: "ward", render: (_, r) => `${r.ward} · ${r.bed}` },
    { title: "Admitted", dataIndex: "admittedAt", key: "admittedAt" },
    { title: "Diagnosis", dataIndex: "diagnosis", key: "diagnosis" },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) => (
        <Space>
          <Button size="small" onClick={() => setNoteFor(r)}>Progress note</Button>
          <Popconfirm
            title="Discharge requires a discharge summary. Proceed?"
            onConfirm={() => discharge(r)}
            okText="Discharge"
          >
            <Button size="small" danger>Discharge</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {WARD_SUMMARY.map((w) => {
          const free = w.totalBeds - w.occupiedBeds;
          const pct = Math.round((w.occupiedBeds / w.totalBeds) * 100);
          return (
            <Col xs={24} md={8} key={w.id}>
              <Card size="small" title={w.name}>
                <Progress percent={pct} status={pct >= 90 ? "exception" : "active"} />
                <div style={{ marginTop: 8, color: "var(--emr-text-muted)" }}>
                  {w.occupiedBeds}/{w.totalBeds} occupied · {free} free
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      <ContentCard
        toolbar={
          <PageToolbar
            actions={
              <CreateButton onClick={() => message.info("Admit flow (mock): select patient → ward → bed.")}>
                Admit patient
              </CreateButton>
            }
          />
        }
      >
        <DataTable<Inpatient> rowKey="id" columns={columns} dataSource={rows} />
      </ContentCard>

      <Modal
        open={!!noteFor}
        title={noteFor ? `Daily progress note — ${noteFor.patientName}` : "Progress note"}
        okText="Save note"
        onOk={() => {
          message.success("Progress note saved (mock).");
          setNote("");
          setNoteFor(null);
        }}
        onCancel={() => {
          setNote("");
          setNoteFor(null);
        }}
      >
        <Input.TextArea
          rows={4}
          placeholder="Subjective / objective / plan for today…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Modal>
    </>
  );
}
