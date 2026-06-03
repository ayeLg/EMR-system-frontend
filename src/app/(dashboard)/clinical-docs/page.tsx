"use client";

import { Tabs } from "antd";
import { PageHeader } from "@/components/ui/PageHeader";
import { MarBoard } from "@/features/clinical-docs/MarBoard";
import { DocBuilder } from "@/features/clinical-docs/DocBuilder";

export default function ClinicalDocsPage() {
  return (
    <>
      <PageHeader title="Clinical documents" subtitle="MAR & document generation" />
      <Tabs
        items={[
          { key: "mar", label: "MAR", children: <MarBoard /> },
          {
            key: "referral",
            label: "Referral letter",
            children: (
              <DocBuilder
                docTitle="Referral Letter"
                fields={[
                  { name: "patient", label: "Patient" },
                  { name: "to", label: "Refer to (hospital / specialist)" },
                  { name: "specialty", label: "Specialty" },
                  { name: "reason", label: "Reason for referral", type: "textarea" },
                  { name: "summary", label: "Clinical summary", type: "textarea" },
                ]}
              />
            ),
          },
          {
            key: "certificate",
            label: "Medical certificate",
            children: (
              <DocBuilder
                docTitle="Medical Certificate"
                fields={[
                  { name: "patient", label: "Patient" },
                  { name: "diagnosis", label: "Diagnosis" },
                  { name: "restDays", label: "Days of rest", type: "number" },
                  { name: "fromDate", label: "From date" },
                  { name: "remarks", label: "Remarks", type: "textarea" },
                ]}
              />
            ),
          },
          {
            key: "discharge",
            label: "Discharge summary",
            children: (
              <DocBuilder
                docTitle="Discharge Summary"
                fields={[
                  { name: "patient", label: "Patient" },
                  { name: "admitDx", label: "Admitting diagnosis" },
                  { name: "finalDx", label: "Final diagnosis" },
                  { name: "treatment", label: "Treatment given", type: "textarea" },
                  { name: "followUp", label: "Follow-up plan", type: "textarea" },
                  { name: "meds", label: "Discharge medications", type: "textarea" },
                ]}
              />
            ),
          },
        ]}
      />
    </>
  );
}
