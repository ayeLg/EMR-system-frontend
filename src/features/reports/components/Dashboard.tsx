"use client";

import dynamic from "next/dynamic";
import { Card, Col, Row, Skeleton, Statistic, theme } from "antd";
import {
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { useDashboardStats } from "../hooks/useReports";

const Area = dynamic(() => import("@ant-design/plots").then((m) => ({ default: m.Area })), { ssr: false });
const Column = dynamic(() => import("@ant-design/plots").then((m) => ({ default: m.Column })), { ssr: false });
const Pie = dynamic(() => import("@ant-design/plots").then((m) => ({ default: m.Pie })), { ssr: false });

const CHART_HEIGHT = 240;

function KpiCard({
  title,
  value,
  prefix,
  suffix,
  loading,
}: {
  title: string;
  value?: number;
  prefix: React.ReactNode;
  suffix?: string;
  loading?: boolean;
}) {
  const { token } = theme.useToken();

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
      }}
    >
      {loading ? (
        <Skeleton active paragraph={false} />
      ) : (
        <Statistic title={title} value={value ?? 0} prefix={prefix} suffix={suffix} />
      )}
    </Card>
  );
}

export function Dashboard() {
  const { token } = theme.useToken();
  const { data, isLoading } = useDashboardStats();

  const chartCardStyle = {
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowTertiary,
  };

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} md={6}>
          <KpiCard
            title="Total patients"
            value={data?.kpis.totalPatients}
            prefix={<TeamOutlined />}
            loading={isLoading}
          />
        </Col>
        <Col xs={12} md={6}>
          <KpiCard
            title="Today's appointments"
            value={data?.kpis.todayAppointments}
            prefix={<CalendarOutlined />}
            loading={isLoading}
          />
        </Col>
        <Col xs={12} md={6}>
          <KpiCard
            title="Revenue (today)"
            value={data?.kpis.revenueToday}
            suffix="Ks"
            prefix={<DollarOutlined />}
            loading={isLoading}
          />
        </Col>
        <Col xs={12} md={6}>
          <KpiCard
            title="Pending lab"
            value={data?.kpis.pendingLab}
            prefix={<ExperimentOutlined />}
            loading={isLoading}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card size="small" title="Patient census (7 days)" variant="borderless" style={chartCardStyle}>
            {isLoading ? (
              <Skeleton active />
            ) : (
              <Area
                data={data?.censusSeries ?? []}
                xField="date"
                yField="patients"
                height={CHART_HEIGHT}
                shapeField="smooth"
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Revenue by department" variant="borderless" style={chartCardStyle}>
            {isLoading ? (
              <Skeleton active />
            ) : (
              <Column
                data={data?.revenueByDept ?? []}
                xField="dept"
                yField="revenue"
                height={CHART_HEIGHT}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Disease burden (top 5)" variant="borderless" style={chartCardStyle}>
            {isLoading ? (
              <Skeleton active />
            ) : (
              <Column
                data={data?.diseaseBurden ?? []}
                xField="disease"
                yField="count"
                height={CHART_HEIGHT}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Appointment status" variant="borderless" style={chartCardStyle}>
            {isLoading ? (
              <Skeleton active />
            ) : (
              <Pie
                data={data?.apptStatusBreakdown ?? []}
                angleField="value"
                colorField="type"
                height={CHART_HEIGHT}
                innerRadius={0.5}
              />
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
}
