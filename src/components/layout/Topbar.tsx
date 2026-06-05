"use client";

import { Avatar, Button, Dropdown, Flex, Space, Typography } from "antd";
import {
  BulbOutlined,
  GlobalOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useUIStore } from "@/store/ui-store";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { usePermissions } from "@/lib/rbac/usePermissions";
import { LOCALE_LABELS } from "@/i18n/config";
import { NotificationBell } from "@/features/notifications/NotificationBell";
import { GlobalSearchTrigger } from "@/components/search/GlobalSearchTrigger";

const { Text } = Typography;

export function Topbar({
  showHamburger,
  onOpenDrawer,
  showBrand,
}: {
  showHamburger: boolean;
  onOpenDrawer: () => void;
  showBrand?: boolean;
}) {
  const t = useTranslations();
  const locale = useUIStore((s) => s.locale);
  const toggleLocale = useUIStore((s) => s.toggleLocale);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const { user } = usePermissions();
  const logout = useLogout();

  return (
    <Flex align="center" gap={16} style={{ width: "100%" }}>
      {showHamburger ? (
        <Button type="text" icon={<MenuOutlined />} onClick={onOpenDrawer} />
      ) : null}

      {showBrand ? (
        <Text strong style={{ fontSize: 15, whiteSpace: "nowrap" }}>
          {t("common.appName")}
        </Text>
      ) : null}

      <div className="emr-global-search">
        <GlobalSearchTrigger />
      </div>

      <Space size={4} className="emr-topbar-actions" style={{ marginInlineStart: "auto" }}>
        <Button
          type="text"
          icon={<GlobalOutlined />}
          onClick={toggleLocale}
          aria-label="Toggle language"
        >
          {LOCALE_LABELS[locale]}
        </Button>

        <Button
          type="text"
          icon={<BulbOutlined />}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        />

        <NotificationBell />

        <Dropdown
          menu={{
            onClick: ({ key }) => {
              if (key === "logout") logout();
            },
            items: [
              {
                key: "user",
                disabled: true,
                label: (
                  <div style={{ lineHeight: 1.3 }}>
                    <div style={{ fontWeight: 600 }}>{user.name}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {user.role}
                    </Text>
                  </div>
                ),
              },
              { type: "divider" },
              {
                key: "profile",
                icon: <UserOutlined />,
                label: t("topbar.profile"),
              },
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: t("topbar.logout"),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Avatar
            style={{
              background: "linear-gradient(135deg, #1677ff 0%, #4096ff 100%)",
              cursor: "pointer",
            }}
            size="default"
          >
            {user.name.charAt(0)}
          </Avatar>
        </Dropdown>
      </Space>
    </Flex>
  );
}
