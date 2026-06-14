"use client";

import { useRouter } from "next/navigation";
import type { TableProps } from "antd";
import { Tag } from "antd";
import dayjs from "dayjs";
import { DataTable } from "@/components/common/DataTable";
import { ContentCard } from "@/components/ui/ContentCard";
import { ROUTES } from "@/config/routes";
import { useInvoices } from "../hooks/useBilling";
import { INVOICE_STATUS_META, formatMMK } from "../constants";
import type { Invoice } from "../types";

export function InvoiceTable() {
  const router = useRouter();
  const { data, isLoading } = useInvoices();

  const columns: TableProps<Invoice>["columns"] = [
    { title: "Invoice No.", dataIndex: "invoiceNo", key: "invoiceNo" },
    { title: "Patient", key: "patient", render: (_, r) => `${r.patientName} · ${r.mrn}` },
    { title: "Total", key: "total", render: (_, r) => formatMMK(r.totalAmount) },
    { title: "Balance", key: "balance", render: (_, r) => formatMMK(r.patientBalance) },
    {
      title: "Issued",
      dataIndex: "issuedAt",
      key: "issuedAt",
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm") : "—"),
    },
    {
      title: "Status",
      key: "status",
      render: (_, r) => (
        <Tag color={INVOICE_STATUS_META[r.status].color}>
          {INVOICE_STATUS_META[r.status].label}
        </Tag>
      ),
    },
  ];

  return (
    <ContentCard>
      <DataTable<Invoice>
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={isLoading}
        onRow={(record) => ({
          onClick: () => router.push(`${ROUTES.billing}/${record.id}`),
          style: { cursor: "pointer" },
        })}
      />
    </ContentCard>
  );
}
