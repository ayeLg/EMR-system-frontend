"use client";

import { theme } from "antd";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: token.colorBgLayout,
      }}
    >
      {children}
    </div>
  );
}
