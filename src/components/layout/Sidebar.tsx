"use client";

import { Layout, theme } from "antd";
import { useTranslations } from "next-intl";
import { useUIStore } from "@/store/ui-store";
import { APP } from "@/config/app";
import { NavMenu } from "./NavMenu";

const { Sider } = Layout;

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const setCollapsed = useUIStore((s) => s.setSidebarCollapsed);
  const t = useTranslations();
  const { token } = theme.useToken();

  return (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={APP.sidebarWidth}
      collapsedWidth={APP.sidebarCollapsedWidth}
      style={{
        background: token.colorBgContainer,
        borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 48,
          padding: "0 16px",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: token.colorPrimary,
            flexShrink: 0,
          }}
        />
        {!collapsed ? (
          <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
            {t("common.appName")}
          </span>
        ) : null}
      </div>
      <NavMenu />
    </Sider>
  );
}
