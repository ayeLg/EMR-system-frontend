"use client";

import { Drawer, Layout, theme } from "antd";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { APP } from "@/config/app";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { NavMenu } from "./NavMenu";
import { GlobalSearchCommand } from "@/components/search/GlobalSearchCommand";

const { Header, Content } = Layout;

export function AppShell({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery(`(max-width: ${APP.mobileBreakpoint - 1}px)`);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { token } = theme.useToken();

  return (
    <Layout className="emr-app-shell">
      {!isMobile ? <Sidebar /> : null}

      <Layout className="emr-app-main">
        <Header
          className="emr-app-header"
          style={{
            height: 56,
            paddingInline: 20,
            background: token.colorBgContainer,
            borderBlockEnd: `1px solid ${token.colorBorderSecondary}`,
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Topbar
            showHamburger={isMobile}
            showBrand={isMobile}
            onOpenDrawer={() => setDrawerOpen(true)}
          />
        </Header>

        <Content
          className="emr-app-content"
          style={{
            padding: "24px 20px 32px",
            background: token.colorBgLayout,
          }}
        >
          <div className="emr-dashboard-content">{children}</div>
        </Content>
      </Layout>

      <Drawer
        placement="left"
        open={isMobile && drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size="default"
        styles={{ body: { padding: 0 } }}
      >
        <NavMenu onNavigate={() => setDrawerOpen(false)} />
      </Drawer>

      <GlobalSearchCommand />
    </Layout>
  );
}
