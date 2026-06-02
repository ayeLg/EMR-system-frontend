"use client";

import dynamic from "next/dynamic";
import { Card, Col, Row, Statistic, theme } from "antd";
import {
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import {
  KPIS,
  CENSUS_SERIES,
  REVENUE_BY_DEPT,
  DISEASE_BURDEN,
  APPT_STATUS_BREAKDOWN,
} from "../data";

const Area = dynamic(() => import("@ant-design/plots").then((m) => ({ default: m.Area })), { ssr: false });
const Column = dynamic(() => import("@ant-design/plots").then((m) => ({ default: m.Column })), { ssr: false });
const Pie = dynamic(() => import("@ant-design/plots").then((m) => ({ default: m.Pie })), { ssr: false });

const CHART_HEIGHT = 240;

function KpiCard({
  title,
  value,
  prefix,
  suffix,
}: {
  title: string;
  value: number;
  prefix: React.ReactNode;
  suffix?: string;
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
      <Statistic title={title} value={value} prefix={prefix} suffix={suffix} />
    </Card>
  );
}

export function Dashboard() {
  const { token } = theme.useToken();

  const chartCardStyle = {
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowTertiary,
  };

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} md={6}>
          <KpiCard title="Total patients" value={KPIS.totalPatients} prefix={<TeamOutlined />} />
        </Col>
        <Col xs={12} md={6}>
          <KpiCard
            title="Today's appointments"
            value={KPIS.todayAppointments}
            prefix={<CalendarOutlined />}
          />
        </Col>
        <Col xs={12} md={6}>
          <KpiCard
            title="Revenue (today)"
            value={KPIS.revenueToday}
            suffix="Ks"
            prefix={<DollarOutlined />}
          />
        </Col>
        <Col xs={12} md={6}>
          <KpiCard title="Pending lab" value={KPIS.pendingLab} prefix={<ExperimentOutlined />} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card size="small" title="Patient census (7 days)" variant="borderless" style={chartCardStyle}>
            <Area data={CENSUS_SERIES} xField="date" yField="patients" height={CHART_HEIGHT} shapeField="smooth" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Revenue by department" variant="borderless" style={chartCardStyle}>
            <Column data={REVENUE_BY_DEPT} xField="dept" yField="revenue" height={CHART_HEIGHT} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Disease burden (top 5)" variant="borderless" style={chartCardStyle}>
            <Column data={DISEASE_BURDEN} xField="disease" yField="count" height={CHART_HEIGHT} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Appointment status" variant="borderless" style={chartCardStyle}>
            <Pie
              data={APPT_STATUS_BREAKDOWN}
              angleField="value"
              colorField="type"
              height={CHART_HEIGHT}
              innerRadius={0.5}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
