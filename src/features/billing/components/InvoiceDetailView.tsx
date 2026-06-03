"use client";

import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import { App, Button, Card, Descriptions, Flex, Popconfirm, Skeleton, Space, Table, Tag } from "antd";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { useInvoice } from "../hooks/useBilling";
import { INVOICE_STATUS_META, PAYMENT_METHOD_OPTIONS, formatMMK } from "../constants";
import type { InvoiceItem, Payment, PaymentMethod } from "../types";
import { PaymentModal } from "./PaymentModal";

const methodLabel = (m: PaymentMethod) =>
  PAYMENT_METHOD_OPTIONS.find((o) => o.value === m)?.label ?? m;

export function InvoiceDetailView({ id }: { id: string }) {
  const { data, isLoading } = useInvoice(id);
  const { message } = App.useApp();
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const rows = useMemo(
    () => payments ?? data?.payments ?? [],
    [payments, data],
  );
  const paid = useMemo(() => rows.reduce((s, p) => s + p.amount, 0), [rows]);

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (!data) return <EmptyState description="Invoice not found" />;

  const outstanding = data.patientBalance - paid;

  const itemColumns: TableProps<InvoiceItem>["columns"] = [
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Qty", dataIndex: "quantity", key: "quantity" },
    { title: "Unit price", key: "unitPrice", render: (_, r) => formatMMK(r.unitPrice) },
    { title: "Total", key: "total", render: (_, r) => formatMMK(r.total) },
  ];

  return (
    <>
      <PageHeader
        title={data.invoiceNo}
        subtitle={`${data.patientName} · ${data.mrn}`}
        actions={
          <Space wrap>
            <Tag color={INVOICE_STATUS_META[data.status].color}>
              {INVOICE_STATUS_META[data.status].label}
            </Tag>
            {outstanding > 0 ? (
              <Button type="primary" onClick={() => setModalOpen(true)}>
                Record payment
              </Button>
            ) : null}
            <Button onClick={() => message.info("Insurance claim submitted to TPA (mock).")}>
              Submit claim
            </Button>
            {data.status === "PAID" ? (
              <Button onClick={() => message.info("Credit note created (mock). PAID invoices cannot be voided directly.")}>
                Create credit note
              </Button>
            ) : data.status !== "VOID" ? (
              <Popconfirm
                title="Void invoice? (supervisor only, reason required, audit-logged)"
                onConfirm={() => message.success("Invoice voided (mock). Reason logged to audit.")}
                okText="Void"
                okButtonProps={{ danger: true }}
              >
                <Button danger>Void</Button>
              </Popconfirm>
            ) : null}
          </Space>
        }
      />

      <Table<InvoiceItem>
        rowKey="id"
        size="small"
        bordered
        columns={itemColumns}
        dataSource={data.items}
        pagination={false}
        style={{ marginBottom: 16 }}
      />

      <Card size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label="Subtotal">{formatMMK(data.subtotal)}</Descriptions.Item>
          <Descriptions.Item label="Discount">− {formatMMK(data.discountAmount)}</Descriptions.Item>
          <Descriptions.Item label="Tax">+ {formatMMK(data.taxAmount)}</Descriptions.Item>
          <Descriptions.Item label="Total">{formatMMK(data.totalAmount)}</Descriptions.Item>
          <Descriptions.Item label="Insurance coverage">− {formatMMK(data.insuranceCoverage)}</Descriptions.Item>
          <Descriptions.Item label="Patient balance">{formatMMK(data.patientBalance)}</Descriptions.Item>
          <Descriptions.Item label="Paid">{formatMMK(paid)}</Descriptions.Item>
          <Descriptions.Item label="Outstanding">
            <strong style={{ color: outstanding > 0 ? "#cf1322" : "#389e0d" }}>
              {formatMMK(outstanding)}
            </strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small" title={`Payments (${rows.length})`}>
        {rows.length === 0 ? (
          <EmptyState description="No payments yet" />
        ) : (
          <Flex vertical gap={6}>
            {rows.map((p) => (
              <div key={p.id}>
                {formatMMK(p.amount)} · {methodLabel(p.method)} · {p.paidAt}
              </div>
            ))}
          </Flex>
        )}
      </Card>

      <PaymentModal
        open={modalOpen}
        outstanding={outstanding}
        onClose={() => setModalOpen(false)}
        onRecord={(amount, method) => {
          setPayments([
            ...rows,
            { id: `p${rows.length + 1}`, amount, method, paidAt: "now" },
          ]);
          setModalOpen(false);
          message.success(`Payment of ${formatMMK(amount)} recorded.`);
        }}
      />
    </>
  );
}
