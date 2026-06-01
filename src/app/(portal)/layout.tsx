"use client";

import { theme, Typography } from "antd";
import { HeartFilled } from "@ant-design/icons";
import type { ReactNode } from "react";

const { Text } = Typography;

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { token } = theme.useToken();
  return (
    <div style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      <header
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 20px",
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <HeartFilled style={{ color: "#1677ff", fontSize: 20 }} />
        <Text strong style={{ fontSize: 16 }}>
          Yangon EMR — Patient Portal
        </Text>
      </header>
      <main style={{ maxWidth: 760, margin: "0 auto", padding: 20 }}>
        {children}
      </main>
    </div>
  );
}
