"use client";

import { App, Button, Skeleton, Tabs, Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import {
  useEncounter,
  useUpdateEncounterStatus,
} from "../hooks/useEncounters";
import { ENC_STATUS_META } from "../constants";
import { EncounterContext } from "./EncounterContext";
import { SoapNote } from "./SoapNote";
import { VitalsPanel } from "./VitalsPanel";
import { DiagnosesPanel } from "./DiagnosesPanel";
import { OrdersPanel } from "./OrdersPanel";

export function EncounterDetailView({ id }: { id: string }) {
  const { data, isLoading } = useEncounter(id);
  const updateStatus = useUpdateEncounterStatus(id);
  const { message, modal } = App.useApp();

  if (isLoading) return <Skeleton active paragraph={{ rows: 8 }} />;
  if (!data) return <EmptyState description="Encounter not found" />;

  const complete = () =>
    modal.confirm({
      title: "Complete encounter?",
      content:
        "This closes the encounter and triggers billing auto-capture. Requires at least one diagnosis.",
      okText: "Complete",
      onOk: async () => {
        await updateStatus.mutateAsync("COMPLETED");
        message.success("Encounter completed. Billing draft created.");
      },
    });

  return (
    <>
      <PageHeader
        title={data.encounterNo}
        subtitle={`${data.patientName} - ${data.mrn}`}
        actions={
          <>
            <Tag
              color={ENC_STATUS_META[data.status].color}
              style={{ marginInlineEnd: 8 }}
            >
              {ENC_STATUS_META[data.status].label}
            </Tag>
            {data.status === "OPEN" ? (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={complete}
                loading={updateStatus.isPending}
              >
                Complete encounter
              </Button>
            ) : null}
          </>
        }
      />

      <EncounterContext detail={data} />

      <Tabs
        items={[
          {
            key: "soap",
            label: "SOAP note",
            children: <SoapNote encounterId={id} />,
          },
          {
            key: "vitals",
            label: "Vitals",
            children: <VitalsPanel encounterId={id} vitals={data.vitals} />,
          },
          {
            key: "diagnoses",
            label: "Diagnoses",
            children: (
              <DiagnosesPanel encounterId={id} initial={data.diagnoses} />
            ),
          },
          { key: "orders", label: "Orders", children: <OrdersPanel /> },
        ]}
      />
    </>
  );
}
