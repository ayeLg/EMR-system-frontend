"use client";

import { useState } from "react";
import type { TableProps } from "antd";
import { Alert, App, Button, Flex, InputNumber, Table, Tag, Typography } from "antd";
import { WarningFilled } from "@ant-design/icons";

const { Text } = Typography;
import { evaluateResult, FLAG_META, type ResultFlag } from "../constants";
import type { LabTestItem } from "../types";

export function ResultsEntry({ items }: { items: LabTestItem[] }) {
  const { message } = App.useApp();
  const [values, setValues] = useState<Record<string, number | undefined>>({});

  const flagOf = (item: LabTestItem): ResultFlag | null =>
    evaluateResult(values[item.id], item);

  const critical = items.filter((i) => flagOf(i) === "CRITICAL");

  const columns: TableProps<LabTestItem>["columns"] = [
    { title: "Test", dataIndex: "testName", key: "testName" },
    {
      title: "Reference range",
      key: "ref",
      render: (_, r) => `${r.refLow} – ${r.refHigh} ${r.unit}`,
    },
    {
      title: "Result",
      key: "result",
      render: (_, r) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <InputNumber
            value={values[r.id]}
            onChange={(v) =>
              setValues((p) => ({ ...p, [r.id]: v == null ? undefined : Number(v) }))
            }
            style={{ width: 110 }}
          />
          <Text type="secondary">{r.unit}</Text>
        </span>
      ),
    },
    {
      title: "Flag",
      key: "flag",
      render: (_, r) => {
        const f = flagOf(r);
        return f ? <Tag color={FLAG_META[f].color}>{FLAG_META[f].label}</Tag> : "—";
      },
    },
  ];

  return (
    <Flex vertical gap={12}>
      {critical.length > 0 ? (
        <Alert
          type="error"
          showIcon
          icon={<WarningFilled />}
          title={`🔴 Critical value detected (${critical.length})`}
          description={
            <div>
              {critical.map((c) => (
                <div key={c.id}>
                  {c.testName}: {values[c.id]} {c.unit} (critical ≤ {c.criticalLow} or ≥ {c.criticalHigh})
                </div>
              ))}
              <div style={{ marginTop: 8 }}>
                Protocol: notify ordering doctor immediately (in-app + SMS), require
                acknowledgement within 30 min, else escalate to department head.
              </div>
            </div>
          }
          action={
            <Button
              danger
              size="small"
              onClick={() =>
                message.warning(
                  "Critical value alert sent to ordering doctor (in-app + SMS). 30-min ack timer started.",
                )
              }
            >
              Notify doctor
            </Button>
          }
        />
      ) : null}

      <Table<LabTestItem>
        rowKey="id"
        size="small"
        bordered
        columns={columns}
        dataSource={items}
        pagination={false}
      />

      <Flex justify="flex-end" gap={8}>
        <Button onClick={() => message.success("Specimen collected (mock).")}>
          Collect specimen
        </Button>
        <Button
          onClick={() => message.success("Results saved & sent for verification (mock).")}
        >
          Save results
        </Button>
        <Button
          type="primary"
          onClick={() => message.success("Verified by pathologist (mock) → status VERIFIED.")}
        >
          Verify &amp; release
        </Button>
      </Flex>
    </Flex>
  );
}
