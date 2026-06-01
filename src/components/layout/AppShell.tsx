"use client";

import { Drawer, Layout, theme } from "antd";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { APP } from "@/config/app";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { NavMenu } from "./NavMenu";

const { Header, Content } = Layout;

export function AppShell({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery(`(max-width: ${APP.mobileBreakpoint - 1}px)`);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { token } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isMobile ? <Sidebar /> : null}

      <Layout>
        <Header
          style={{
            height: 48,
            paddingInline: 16,
            background: token.colorBgContainer,
            borderBlockEnd: `1px solid ${token.colorBorderSecondary}`,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Topbar
            showHamburger={isMobile}
            onOpenDrawer={() => setDrawerOpen(true)}
          />
        </Header>

        <Content style={{ padding: 16, background: token.colorBgLayout }}>
          {children}
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
    </Layout>
  );
}
