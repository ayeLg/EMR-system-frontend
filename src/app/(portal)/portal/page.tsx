"use client";

import { Card, Flex, Tag, Typography } from "antd";
import { CalendarOutlined, MedicineBoxOutlined, ExperimentOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function PortalPage() {
  return (
    <Flex vertical gap={16}>
      <div>
        <Title level={4} style={{ margin: 0 }}>
          Welcome, Aung Aung
        </Title>
        <Text type="secondary">MRN-0100043</Text>
      </div>

      <Card size="small" title={<><CalendarOutlined /> Next appointment</>}>
        <Text strong>01 Jun 2026, 09:00</Text>
        <div>
          <Text type="secondary">Cardiology · Dr. Aung Aung</Text>
        </div>
        <Tag color="blue" style={{ marginTop: 8 }}>
          Scheduled
        </Tag>
      </Card>

      <Card size="small" title={<><MedicineBoxOutlined /> My prescriptions</>}>
        <Flex vertical gap={6}>
          <div>Amlodipine 5mg — 1 tablet daily</div>
          <div>Metformin 500mg — twice daily</div>
        </Flex>
      </Card>

      <Card size="small" title={<><ExperimentOutlined /> My recent results</>}>
        <Flex vertical gap={6}>
          <Flex justify="space-between">
            <span>Hemoglobin</span>
            <span>14.2 g/dL <Tag color="green">Normal</Tag></span>
          </Flex>
          <Flex justify="space-between">
            <span>Potassium</span>
            <span>4.6 mmol/L <Tag color="green">Normal</Tag></span>
          </Flex>
        </Flex>
      </Card>

      <Text type="secondary" style={{ fontSize: 12, textAlign: "center" }}>
        Read-only patient view · For medical advice, contact your doctor.
      </Text>
    </Flex>
  );
}
