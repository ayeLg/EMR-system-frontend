"use client";

import { App, Button, Flex, Tabs } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";

function Paper({ children, onPrint }: { children: ReactNode; onPrint: () => void }) {
  return (
    <div>
      <Flex justify="flex-end" style={{ marginBottom: 12 }}>
        <Button type="primary" icon={<PrinterOutlined />} onClick={onPrint}>
          Print
        </Button>
      </Flex>
      <div
        style={{
          background: "#fff",
          color: "#1e1e1e",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: 28,
          maxWidth: 520,
          margin: "0 auto",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        <div style={{ textAlign: "center", borderBottom: "2px solid #1a3c6b", paddingBottom: 10, marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#1a3c6b" }}>Yangon EMR Hospital</div>
          <div style={{ color: "#666", fontSize: 12 }}>No. 1, Pyay Road, Yangon · 01-555000</div>
        </div>
        {children}
      </div>
    </div>
  );
}

const Row = ({ l, r }: { l: string; r: string }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
    <span style={{ color: "#555" }}>{l}</span>
    <span style={{ fontWeight: 500 }}>{r}</span>
  </div>
);

export function PrintPreviews() {
  const { message } = App.useApp();
  const print = (doc: string) => message.success(`${doc} sent to printer (mock).`);

  return (
    <Tabs
      items={[
        {
          key: "rx",
          label: "Prescription",
          children: (
            <Paper onPrint={() => print("Prescription")}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>PRESCRIPTION · RX-0300009</div>
              <Row l="Patient" r="Aung Aung · MRN-0100043" />
              <Row l="Date" r="2026-05-31" />
              <Row l="Prescriber" r="Dr. Aung Aung" />
              <div style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
              <div>℞ Amlodipine 5mg — 1 tab OD × 30 days</div>
              <div>℞ Metformin 500mg — 1 tab BD × 30 days</div>
              <div style={{ marginTop: 30, textAlign: "right", color: "#666" }}>_____________<br />Signature</div>
            </Paper>
          ),
        },
        {
          key: "receipt",
          label: "Invoice / Receipt",
          children: (
            <Paper onPrint={() => print("Receipt")}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>OFFICIAL RECEIPT · INV-0500007</div>
              <Row l="Patient" r="Aung Aung · MRN-0100043" />
              <Row l="Date" r="2026-05-31 11:05" />
              <div style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
              <Row l="OPD Consultation — Cardiology" r="30,000 Ks" />
              <Row l="ECG" r="25,000 Ks" />
              <Row l="Lab — Lipid panel" r="35,000 Ks" />
              <div style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
              <Row l="Subtotal" r="90,000 Ks" />
              <Row l="Discount" r="− 10,000 Ks" />
              <Row l="Tax" r="+ 5,000 Ks" />
              <Row l="Total" r="85,000 Ks" />
              <Row l="Paid (Cash)" r="25,000 Ks" />
              <Row l="Outstanding" r="60,000 Ks" />
            </Paper>
          ),
        },
        {
          key: "lab",
          label: "Lab report",
          children: (
            <Paper onPrint={() => print("Lab report")}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>LABORATORY REPORT · LAB-0400031</div>
              <Row l="Patient" r="Aung Aung · MRN-0100043" />
              <Row l="Collected" r="2026-05-31 09:30" />
              <div style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
              <Row l="Hemoglobin (13.5–17.5 g/dL)" r="14.2  ✔" />
              <Row l="WBC (4–11 10³/µL)" r="9.1  ✔" />
              <Row l="Potassium (3.5–5.1 mmol/L)" r="7.0  ⚠ CRITICAL" />
              <div style={{ marginTop: 24, textAlign: "right", color: "#666" }}>Verified: Pathologist</div>
            </Paper>
          ),
        },
        {
          key: "mrn",
          label: "MRN card",
          children: (
            <Paper onPrint={() => print("MRN card")}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>MRN-0100043</div>
                <div style={{ fontSize: 16, marginTop: 6 }}>Aung Aung</div>
                <div style={{ color: "#666", marginTop: 4 }}>Male · DOB 1988-03-12 · O+</div>
                <div style={{ color: "#666", marginTop: 4 }}>09-771234567</div>
                <div style={{ marginTop: 14, fontFamily: "monospace", letterSpacing: 4, fontSize: 26 }}>▮▮▎▎▮▎▮▮▎▮▎▎▮</div>
              </div>
            </Paper>
          ),
        },
      ]}
    />
  );
}
