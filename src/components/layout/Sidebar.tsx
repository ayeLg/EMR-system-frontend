"use client";

import { Layout, theme } from "antd";
import { MedicineBoxOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useUIStore } from "@/store/ui-store";
import { APP } from "@/config/app";
import { NavMenu } from "./NavMenu";

const { Sider } = Layout;

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const themeMode = useUIStore((s) => s.theme);
  const t = useTranslations();
  const { token } = theme.useToken();

  return (
    <Sider
      className="emr-sidebar"
      theme={themeMode === "dark" ? "dark" : "light"}
      collapsed={collapsed}
      trigger={null}
      width={APP.sidebarWidth}
      collapsedWidth={APP.sidebarCollapsedWidth}
      style={{
        background: token.colorBgContainer,
        borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <div className="emr-sidebar-inner">
        <div className="emr-sidebar-brand">
          <div className="emr-sidebar-logo" aria-hidden>
            <MedicineBoxOutlined />
          </div>
          {!collapsed ? (
            <span className="emr-sidebar-title">{t("common.appName")}</span>
          ) : null}
        </div>
        <div className="emr-sidebar-nav">
          <NavMenu collapsed={collapsed} />
        </div>
      </div>
    </Sider>
  );
}
