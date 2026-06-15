"use client";

import { useState } from "react";
import type { TableProps } from "antd";
import { App, Button, Card, Descriptions, Flex, Skeleton, Space, Table, Tag } from "antd";
import dayjs from "dayjs";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import {
  useInvoice,
  useRecordPayment,
  useSubmitClaim,
  useVoidInvoice,
} from "../hooks/useBilling";
import { INVOICE_STATUS_META, PAYMENT_METHOD_OPTIONS, formatMMK } from "../constants";
import type { InvoiceItem, PaymentMethod } from "../types";
import { PaymentModal } from "./PaymentModal";
import { SubmitClaimModal } from "./SubmitClaimModal";
import { VoidInvoiceModal } from "./VoidInvoiceModal";

const methodLabel = (m: PaymentMethod) =>
  PAYMENT_METHOD_OPTIONS.find((o) => o.value === m)?.label ?? m;

export function InvoiceDetailView({ id }: { readonly id: string }) {
  const { data, isLoading, error } = useInvoice(id);
  const { message } = App.useApp();

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [voidOpen, setVoidOpen] = useState(false);

  // Mutations
  const recordPaymentMutation = useRecordPayment(id);
  const submitClaimMutation = useSubmitClaim(id);
  const voidInvoiceMutation = useVoidInvoice(id);

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (error || !data) return <EmptyState description="Invoice not found or error loading invoice" />;

  const outstanding = data.patientBalance;
  const isVoid = data.status === "VOID";
  const isPaid = data.status === "PAID";

  const handleRecordPayment = async (
    amount: number,
    method: PaymentMethod,
    referenceNo?: string,
    notes?: string
  ) => {
    try {
      await recordPaymentMutation.mutateAsync({ amount, method, referenceNo, notes });
      setPaymentOpen(false);
      message.success(`Payment of ${formatMMK(amount)} recorded successfully.`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      message.error(error.response?.data?.message || "Failed to record payment.");
    }
  };

  const handleSubmitClaim = async (insuranceProvider: string, policyNumber: string) => {
    try {
      await submitClaimMutation.mutateAsync({ insuranceProvider, policyNumber });
      setClaimOpen(false);
      message.success("Insurance claim submitted and processed successfully.");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      message.error(error.response?.data?.message || "Failed to submit insurance claim.");
    }
  };

  const handleVoidInvoice = async (reason: string) => {
    try {
      await voidInvoiceMutation.mutateAsync({ reason });
      setVoidOpen(false);
      message.success("Invoice voided successfully.");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      message.error(error.response?.data?.message || "Failed to void invoice.");
    }
  };

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
            {outstanding > 0 && !isVoid ? (
              <Button type="primary" onClick={() => setPaymentOpen(true)}>
                Record payment
              </Button>
            ) : null}
            {!isVoid && !isPaid && data.insuranceCoverage === 0 ? (
              <Button onClick={() => setClaimOpen(true)}>
                Submit claim
              </Button>
            ) : null}
            {isPaid && (
              <Button onClick={() => message.info("Credit note created (mock). PAID invoices cannot be voided directly.")}>
                Create credit note
              </Button>
            )}
            {!isPaid && !isVoid && (
              <Button danger onClick={() => setVoidOpen(true)}>
                Void
              </Button>
            )}
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
          <Descriptions.Item label="Paid">{formatMMK(data.paidAmount)}</Descriptions.Item>
          <Descriptions.Item label="Outstanding">
            <strong style={{ color: outstanding > 0 ? "#cf1322" : "#389e0d" }}>
              {formatMMK(outstanding)}
            </strong>
          </Descriptions.Item>
          {data.notes && (
            <Descriptions.Item label="Notes" span={{ xs: 1, sm: 2 }}>
              {data.notes}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card size="small" title={`Payments (${data.payments?.length ?? 0})`}>
        {!data.payments || data.payments.length === 0 ? (
          <EmptyState description="No payments yet" />
        ) : (
          <Flex vertical gap={6}>
            {data.payments.map((p) => (
              <div key={p.id}>
                {formatMMK(p.amount)} · {methodLabel(p.method)} · {p.paidAt ? dayjs(p.paidAt).format("YYYY-MM-DD HH:mm") : "—"}
                {p.referenceNo && ` (Ref: ${p.referenceNo})`}
                {p.notes && ` - Note: ${p.notes}`}
              </div>
            ))}
          </Flex>
        )}
      </Card>

      <PaymentModal
        open={paymentOpen}
        outstanding={outstanding}
        loading={recordPaymentMutation.isPending}
        onClose={() => setPaymentOpen(false)}
        onRecord={handleRecordPayment}
      />

      <SubmitClaimModal
        open={claimOpen}
        loading={submitClaimMutation.isPending}
        onClose={() => setClaimOpen(false)}
        onSubmit={handleSubmitClaim}
      />

      <VoidInvoiceModal
        open={voidOpen}
        loading={voidInvoiceMutation.isPending}
        onClose={() => setVoidOpen(false)}
        onVoid={handleVoidInvoice}
      />
    </>
  );
}
