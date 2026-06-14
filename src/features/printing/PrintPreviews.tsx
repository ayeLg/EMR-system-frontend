"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { App, Button, Flex, Spin, Tabs } from "antd";
import { PrinterOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import {
  usePrescriptionPrint,
  useInvoicePrint,
  useLabResultPrint,
  usePatientPrint,
  useClinicalDocPrint,
} from "@/features/clinical-docs/hooks/useClinicalDocs";
import type {
  PrescriptionPrintResponse,
  InvoicePrintResponse,
  LabResultPrintResponse,
  PatientPrintResponse,
  ClinicalDocPrintResponse,
} from "@/features/clinical-docs/api/clinical-docs-api";

interface PaperProps {
  readonly children: ReactNode;
  readonly onPrint: () => void;
}

function Paper({ children, onPrint }: PaperProps) {
  const handleBack = () => {
    globalThis.history.back();
  };

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide sidebar, topbar/header, page header, and buttons */
          .emr-app-shell > aside,
          .ant-layout-sider,
          .emr-app-header,
          .emr-page-header,
          .no-print,
          .ant-tabs-nav {
            display: none !important;
          }
          
          /* Prevent height collapse / overflow hiding / flexbox squashing of all layout containers */
          html, body, .ant-layout, .ant-layout-content, .emr-app-shell, .emr-app-main, .emr-app-content, .emr-dashboard-content {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            position: static !important;
            background: #fff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Clean up card margins and borders for print */
          .printable-area {
            position: relative !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 0px !important;
            border: none !important;
            box-shadow: none !important;
            background: #fff !important;
          }
        }
      `}} />
      <Flex className="no-print" justify="space-between" align="center" style={{ marginBottom: 12, maxWidth: 520, margin: "0 auto 12px" }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
        >
          Back
        </Button>
        <Button type="primary" icon={<PrinterOutlined />} onClick={onPrint}>
          Print
        </Button>
      </Flex>
      <div
        className="printable-area"
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
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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

interface RowProps {
  readonly l: string;
  readonly r: string;
}

const Row = ({ l, r }: RowProps) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
    <span style={{ color: "#555" }}>{l}</span>
    <span style={{ fontWeight: 500 }}>{r}</span>
  </div>
);

// 1. Prescription Print Component
interface RxPrintProps {
  readonly rx: PrescriptionPrintResponse;
  readonly onPrint: () => void;
}
function RxPrintView({ rx, onPrint }: RxPrintProps) {
  const prescribedDate = rx.prescribedAt ? new Date(rx.prescribedAt).toISOString().split("T")[0] : "—";
  return (
    <Paper onPrint={onPrint}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: "#1a3c6b" }}>PRESCRIPTION · {rx.rxNumber}</div>
      <Row l="Patient" r={`${rx.patient?.firstName || ""} ${rx.patient?.lastName || ""} · ${rx.patient?.mrn || ""}`} />
      <Row l="Date" r={prescribedDate} />
      <Row l="Prescriber" r={rx.prescribedBy?.fullName || "—"} />
      <div style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
      {rx.items?.map((item) => (
        <div key={item.id} style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 600 }}>
            ℞ {item.medication?.brandName || item.medication?.genericName} ({item.dose})
          </div>
          <div style={{ fontSize: 12, color: "#555", marginLeft: 16 }}>
            Route: {item.route} · Frequency: {item.frequency} {item.durationDays ? `· Duration: ${item.durationDays} days` : ""}
          </div>
          {item.instructions && (
            <div style={{ fontSize: 11, color: "#777", marginLeft: 16, fontStyle: "italic" }}>
              Instructions: {item.instructions}
            </div>
          )}
        </div>
      ))}
      <div style={{ marginTop: 40, textAlign: "right", color: "#666" }}>
        _______________________<br />
        Doctor&apos;s Signature
      </div>
    </Paper>
  );
}

// 2. Invoice Print Component
interface InvoicePrintProps {
  readonly invoice: InvoicePrintResponse;
  readonly onPrint: () => void;
}
function InvoicePrintView({ invoice, onPrint }: InvoicePrintProps) {
  const invoiceDate = invoice.createdAt ? new Date(invoice.createdAt).toLocaleString() : "—";
  return (
    <Paper onPrint={onPrint}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: "#1a3c6b" }}>OFFICIAL RECEIPT · {invoice.invoiceNo}</div>
      <Row l="Patient" r={`${invoice.patient?.firstName || ""} ${invoice.patient?.lastName || ""} · ${invoice.patient?.mrn || ""}`} />
      <Row l="Date" r={invoiceDate} />
      <Row l="Billed By" r={invoice.createdBy?.fullName || "—"} />
      <div style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
      
      {invoice.items?.map((item) => (
        <Row 
          key={item.id} 
          l={`${item.description} (x${item.quantity})`} 
          r={`${Number(item.total).toLocaleString()} Ks`} 
        />
      ))}
      
      <div style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
      <Row l="Subtotal" r={`${Number(invoice.subtotal).toLocaleString()} Ks`} />
      <Row l="Discount" r={`− ${Number(invoice.discountAmount).toLocaleString()} Ks`} />
      <Row l="Tax" r={`+ ${Number(invoice.taxAmount).toLocaleString()} Ks`} />
      <div style={{ borderTop: "1px solid #eee", margin: "5px 0" }} />
      <Row l="Total" r={`${Number(invoice.totalAmount).toLocaleString()} Ks`} />
      <Row l="Paid Amount" r={`${Number(invoice.paidAmount).toLocaleString()} Ks`} />
      <Row l="Outstanding Balance" r={`${Number(invoice.patientBalance).toLocaleString()} Ks`} />
      <div style={{ marginTop: 40, textAlign: "right", color: "#666" }}>
        _______________________<br />
        Cashier&apos;s Signature
      </div>
    </Paper>
  );
}

// 3. Lab Print Component
interface LabPrintProps {
  readonly lab: LabResultPrintResponse;
  readonly onPrint: () => void;
}
function LabPrintView({ lab, onPrint }: LabPrintProps) {
  const labDate = lab.orderedAt ? new Date(lab.orderedAt).toLocaleString() : "—";
  return (
    <Paper onPrint={onPrint}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: "#1a3c6b" }}>LABORATORY REPORT · {lab.orderNo}</div>
      <Row l="Patient" r={`${lab.patient?.firstName || ""} ${lab.patient?.lastName || ""} · ${lab.patient?.mrn || ""}`} />
      <Row l="Date" r={labDate} />
      <Row l="Ordered By" r={lab.orderedBy?.fullName || "—"} />
      <div style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
      
      {lab.items?.map((item) => {
        const resultVal = item.result?.resultValue || "Pending";
        const isCritical = item.result?.isCritical;
        const isAbnormal = item.result?.isAbnormal;
        const statusText = isCritical ? "⚠ CRITICAL" : isAbnormal ? "⚠ Abnormal" : "✔ Normal";
        const statusColor = isCritical ? "#d32f2f" : isAbnormal ? "#ed6c02" : "#2e7d32";
        
        return (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f5f5f5" }}>
            <span style={{ fontWeight: 500 }}>{item.labTest?.name}</span>
            <span>
              <span style={{ marginRight: 8 }}>{resultVal} {item.result?.unit || ""}</span>
              <span style={{ color: statusColor, fontSize: 11, fontWeight: 700 }}>{statusText}</span>
            </span>
          </div>
        );
      })}
      
      <div style={{ marginTop: 40, textAlign: "right", color: "#666" }}>
        Verified: Pathologist
      </div>
    </Paper>
  );
}

// 4. Patient Print Component
interface PatientPrintProps {
  readonly patient: PatientPrintResponse;
  readonly onPrint: () => void;
}
function PatientPrintView({ patient, onPrint }: PatientPrintProps) {
  const dob = patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split("T")[0] : "—";
  return (
    <Paper onPrint={onPrint}>
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 1.5, color: "#1a3c6b" }}>{patient.mrn}</div>
        <div style={{ fontSize: 18, marginTop: 8, fontWeight: 600 }}>{patient.firstName} {patient.lastName}</div>
        <div style={{ color: "#444", marginTop: 6 }}>
          {patient.gender} · DOB: {dob} · Blood: {patient.bloodType}
        </div>
        <div style={{ color: "#666", marginTop: 4 }}>Phone: {patient.primaryPhone}</div>
        <div style={{ marginTop: 16, fontFamily: "monospace", letterSpacing: 4, fontSize: 26, color: "#333" }}>
          ▮▮▎▎▮▎▮▮▎▮▎▎▮
        </div>
      </div>
    </Paper>
  );
}

// 5. Clinical Doc Print Component
interface ClinicalDocPrintProps {
  readonly doc: ClinicalDocPrintResponse;
  readonly onPrint: () => void;
}
function ClinicalDocPrintView({ doc, onPrint }: ClinicalDocPrintProps) {
  let formValues: Record<string, unknown> = {};
  try {
    formValues = JSON.parse(doc.content || "{}") as Record<string, unknown>;
  } catch {}
  
  const formattedTitle = doc.noteType.replace("_", " ").toUpperCase();
  const docDate = doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "—";
  
  return (
    <Paper onPrint={onPrint}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: "#1a3c6b" }}>{formattedTitle}</div>
      <Row 
        l="Patient" 
        r={`${doc.encounter?.patient?.firstName || ""} ${doc.encounter?.patient?.lastName || ""} · ${doc.encounter?.patient?.mrn || ""}`} 
      />
      <Row l="Date" r={docDate} />
      <Row l="Attending Doctor" r={doc.encounter?.attendingDoctor?.fullName || "—"} />
      <div style={{ borderTop: "1px dashed #ccc", margin: "10px 0" }} />
      
      {Object.entries(formValues).map(([key, value]) => {
        if (key === "patient" || key === "encounterId") return null;
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
          
        return (
          <div key={key} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, color: "#555", fontSize: 12 }}>{label}</div>
            <div style={{ color: "#222", whiteSpace: "pre-wrap", background: "#f8f9fa", padding: 8, borderRadius: 4, border: "1px solid #e9ecef" }}>
              {String(value || "—")}
            </div>
          </div>
        );
      })}
      
      <div style={{ marginTop: 40, textAlign: "right", color: "#666" }}>
        _______________________<br />
        Doctor&apos;s Signature
      </div>
    </Paper>
  );
}

function PrintPreviewsContent() {
  const { message } = App.useApp();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id") || "";

  const handlePrint = (docName: string) => {
    globalThis.print();
    message.success(`${docName} sent to printer.`);
  };

  // Queries
  const { data: rx, isLoading: loadingRx } = usePrescriptionPrint(type === "rx" ? id : "");
  const { data: invoice, isLoading: loadingInvoice } = useInvoicePrint(type === "invoice" ? id : "");
  const { data: lab, isLoading: loadingLab } = useLabResultPrint(type === "lab" ? id : "");
  const { data: patient, isLoading: loadingPatient } = usePatientPrint(type === "patient" ? id : "");
  const { data: doc, isLoading: loadingDoc } = useClinicalDocPrint(type === "clinical-doc" ? id : "");

  if (loadingRx || loadingInvoice || loadingLab || loadingPatient || loadingDoc) {
    return (
      <Flex justify="center" align="center" style={{ padding: 100 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  // Route based on type parameter
  if (type === "rx" && rx) {
    return <RxPrintView rx={rx} onPrint={() => handlePrint("Prescription")} />;
  }
  if (type === "invoice" && invoice) {
    return <InvoicePrintView invoice={invoice} onPrint={() => handlePrint("Receipt")} />;
  }
  if (type === "lab" && lab) {
    return <LabPrintView lab={lab} onPrint={() => handlePrint("Lab Report")} />;
  }
  if (type === "patient" && patient) {
    return <PatientPrintView patient={patient} onPrint={() => handlePrint("MRN Card")} />;
  }
  if (type === "clinical-doc" && doc) {
    return <ClinicalDocPrintView doc={doc} onPrint={() => handlePrint(doc.noteType.replace("_", " "))} />;
  }

  // Fallback Static Previews
  return (
    <Tabs
      items={[
        {
          key: "rx",
          label: "Prescription",
          children: (
            <Paper onPrint={() => handlePrint("Prescription")}>
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
            <Paper onPrint={() => handlePrint("Receipt")}>
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
            <Paper onPrint={() => handlePrint("Lab report")}>
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
            <Paper onPrint={() => handlePrint("MRN card")}>
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

export function PrintPreviews() {
  return (
    <Suspense fallback={<Flex justify="center" align="center" style={{ padding: 100 }}><Spin size="large" /></Flex>}>
      <PrintPreviewsContent />
    </Suspense>
  );
}
