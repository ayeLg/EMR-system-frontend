"use client";

import { Collapse, Flex, Tag } from "antd";
import { WarningFilled } from "@ant-design/icons";
import type { ReactNode } from "react";
import type { EncounterDetail } from "../types";

function Rows({ children }: { children: ReactNode }) {
  return (
    <Flex vertical gap={6} style={{ fontSize: 13 }}>
      {children}
    </Flex>
  );
}

export function EncounterContext({ detail }: { detail: EncounterDetail }) {
  return (
    <Collapse
      defaultActiveKey={["allergies"]}
      size="small"
      style={{ marginBottom: 16 }}
      items={[
        {
          key: "allergies",
          label: (
            <span style={{ color: "#cf1322", fontWeight: 600 }}>
              <WarningFilled /> Active allergies ({detail.allergies.length})
            </span>
          ),
          children: (
            <Rows>
              {detail.allergies.map((a) => (
                <div key={a.allergenName}>
                  {a.allergenName}{" "}
                  <Tag color={a.severity === "SEVERE" ? "red" : "orange"}>
                    {a.severity}
                  </Tag>
                </div>
              ))}
            </Rows>
          ),
        },
        {
          key: "meds",
          label: `Current medications (${detail.currentMeds.length})`,
          children: (
            <Rows>
              {detail.currentMeds.map((m) => (
                <div key={m.name}>
                  {m.name} — {m.dose}
                </div>
              ))}
            </Rows>
          ),
        },
        {
          key: "problems",
          label: `Problem list (${detail.problemList.length})`,
          children: (
            <Rows>
              {detail.problemList.map((p) => (
                <div key={p.icd10Code}>
                  <Tag>{p.icd10Code}</Tag> {p.description}
                </div>
              ))}
            </Rows>
          ),
        },
        {
          key: "history",
          label: `Recent encounters (${detail.pastEncounters.length})`,
          children: (
            <Rows>
              {detail.pastEncounters.map((e) => (
                <div key={e.encounterNo}>
                  {e.encounterNo} · {e.date} · {e.type}
                </div>
              ))}
            </Rows>
          ),
        },
      ]}
    />
  );
}
