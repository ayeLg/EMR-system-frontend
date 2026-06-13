"use client";

import { useState } from "react";
import type { TableProps } from "antd";
import { Alert, App, Button, Flex, InputNumber, Table, Tag, Typography } from "antd";
import { WarningFilled } from "@ant-design/icons";
import { evaluateResult, FLAG_META, type ResultFlag } from "../constants";
import {
  useCollectSpecimen,
  useSaveResults,
  useVerifyResults,
} from "../hooks/useLaboratory";
import type { LabStatus, LabTestItem } from "../types";

const { Text } = Typography;

export function ResultsEntry({
  items,
  orderId,
  status,
}: Readonly<{
  items: LabTestItem[];
  orderId: string;
  status: LabStatus;
}>) {
  const { message } = App.useApp();

  const [values, setValues] = useState<Record<string, number | undefined>>(() => {
    const initialValues: Record<string, number | undefined> = {};
    for (const item of items) {
      if (item.value !== undefined) {
        initialValues[item.id] = item.value;
      }
    }
    return initialValues;
  });

  const collectMutation = useCollectSpecimen(orderId);
  const saveMutation = useSaveResults(orderId);
  const verifyMutation = useVerifyResults(orderId);

  const flagOf = (item: LabTestItem): ResultFlag | null =>
    evaluateResult(values[item.id], item);

  const critical = items.filter((i) => flagOf(i) === "CRITICAL");

  const handleCollect = async () => {
    try {
      await collectMutation.mutateAsync(undefined);
      message.success("Specimen collected successfully.");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      message.error(apiErr.message || "Failed to collect specimen");
    }
  };

  const handleSave = async () => {
    const payload = items
      .map((item) => {
        const val = values[item.id];
        return {
          labOrderItemId: item.id,
          value: val === undefined ? "" : String(val),
        };
      })
      .filter((res) => res.value.length > 0);

    if (payload.length === 0) {
      message.warning("Please enter at least one test result.");
      return;
    }

    try {
      await saveMutation.mutateAsync(payload);
      message.success("Results saved successfully.");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      message.error(apiErr.message || "Failed to save results");
    }
  };

  const handleVerify = async () => {
    try {
      await verifyMutation.mutateAsync();
      message.success("Results verified and released.");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      message.error(apiErr.message || "Failed to verify results");
    }
  };

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
            disabled={status === "ORDERED" || status === "VERIFIED"}
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
        <Button
          onClick={handleCollect}
          loading={collectMutation.isPending}
          disabled={status !== "ORDERED"}
        >
          Collect specimen
        </Button>
        <Button
          onClick={handleSave}
          loading={saveMutation.isPending}
          disabled={
            status !== "SPECIMEN_COLLECTED" &&
            status !== "IN_PROCESS" &&
            status !== "RESULTED"
          }
        >
          Save results
        </Button>
        <Button
          type="primary"
          onClick={handleVerify}
          loading={verifyMutation.isPending}
          disabled={status !== "RESULTED"}
        >
          Verify &amp; release
        </Button>
      </Flex>
    </Flex>
  );
}
