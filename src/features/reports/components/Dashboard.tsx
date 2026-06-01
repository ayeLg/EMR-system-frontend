"use client";

import dynamic from "next/dynamic";
import { Card, Col, Row, Statistic } from "antd";
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

// Charts render client-side only (avoid SSR canvas issues).
const Area = dynamic(() => import("@ant-design/plots").then((m) => ({ default: m.Area })), { ssr: false });
const Column = dynamic(() => import("@ant-design/plots").then((m) => ({ default: m.Column })), { ssr: false });
const Pie = dynamic(() => import("@ant-design/plots").then((m) => ({ default: m.Pie })), { ssr: false });

const CHART_HEIGHT = 240;

export function Dashboard() {
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic title="Total patients" value={KPIS.totalPatients} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic title="Today's appointments" value={KPIS.todayAppointments} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic title="Revenue (today)" value={KPIS.revenueToday} suffix="Ks" prefix={<DollarOutlined />} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <Statistic title="Pending lab" value={KPIS.pendingLab} prefix={<ExperimentOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card size="small" title="Patient census (7 days)">
            <Area data={CENSUS_SERIES} xField="date" yField="patients" height={CHART_HEIGHT} shapeField="smooth" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Revenue by department">
            <Column data={REVENUE_BY_DEPT} xField="dept" yField="revenue" height={CHART_HEIGHT} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Disease burden (top 5)">
            <Column data={DISEASE_BURDEN} xField="disease" yField="count" height={CHART_HEIGHT} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Appointment status">
            <Pie data={APPT_STATUS_BREAKDOWN} angleField="value" colorField="type" height={CHART_HEIGHT} innerRadius={0.5} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
