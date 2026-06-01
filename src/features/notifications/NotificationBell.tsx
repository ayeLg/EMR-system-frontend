"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Flex, Popover, Typography } from "antd";
import {
  BellOutlined,
  ExperimentOutlined,
  WarningOutlined,
  MedicineBoxOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { MOCK_NOTIFICATIONS, type NotificationType } from "./data";

const { Text } = Typography;

const ICONS: Record<NotificationType, React.ReactNode> = {
  CRITICAL_VALUE: <WarningOutlined style={{ color: "#cf1322" }} />,
  LAB_RESULT_READY: <ExperimentOutlined style={{ color: "#1677ff" }} />,
  APPOINTMENT_REMINDER: <CalendarOutlined style={{ color: "#13c2c2" }} />,
  MEDICATION_DUE: <MedicineBoxOutlined style={{ color: "#fa8c16" }} />,
  SYSTEM_ALERT: <InfoCircleOutlined style={{ color: "#8c8c8c" }} />,
};

export function NotificationBell() {
  const [items, setItems] = useState(MOCK_NOTIFICATIONS);
  const unread = useMemo(() => items.filter((n) => !n.isRead).length, [items]);

  const markAll = () => setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));

  const content = (
    <div style={{ width: 320 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
        <Text strong>Notifications</Text>
        <Button type="link" size="small" onClick={markAll} disabled={unread === 0}>
          Mark all read
        </Button>
      </Flex>
      <Flex vertical gap={2} style={{ maxHeight: 360, overflowY: "auto" }}>
        {items.map((n) => (
          <Flex
            key={n.id}
            gap={10}
            style={{
              padding: "8px 6px",
              borderRadius: 8,
              background: n.isRead ? "transparent" : "rgba(22,119,255,0.06)",
            }}
          >
            <div style={{ fontSize: 16, lineHeight: "20px" }}>{ICONS[n.type]}</div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ fontSize: 13 }}>
                {n.title}
              </Text>
              <div style={{ fontSize: 12, color: "#64748b" }}>{n.body}</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{n.createdAt}</div>
            </div>
          </Flex>
        ))}
      </Flex>
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <Badge count={unread} size="small">
        <Button type="text" icon={<BellOutlined />} aria-label="Notifications" />
      </Badge>
    </Popover>
  );
}
