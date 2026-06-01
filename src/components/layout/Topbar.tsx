"use client";

import { Avatar, Button, Dropdown, Flex, Input, Space, Typography } from "antd";
import {
  BulbOutlined,
  GlobalOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useUIStore } from "@/store/ui-store";
import { usePermissions } from "@/lib/rbac/usePermissions";
import { LOCALE_LABELS } from "@/i18n/config";
import { NotificationBell } from "@/features/notifications/NotificationBell";

const { Text } = Typography;

export function Topbar({
  showHamburger,
  onOpenDrawer,
}: {
  showHamburger: boolean;
  onOpenDrawer: () => void;
}) {
  const t = useTranslations();
  const locale = useUIStore((s) => s.locale);
  const toggleLocale = useUIStore((s) => s.toggleLocale);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const { user } = usePermissions();

  return (
    <Flex align="center" gap={12} style={{ width: "100%" }}>
      {showHamburger ? (
        <Button type="text" icon={<MenuOutlined />} onClick={onOpenDrawer} />
      ) : null}

      <Text strong style={{ fontSize: 15, whiteSpace: "nowrap" }}>
        {t("common.appName")}
      </Text>

      <Input
        prefix={<span style={{ color: "#94a3b8" }}>🔍</span>}
        placeholder={t("common.search")}
        variant="filled"
        style={{ maxWidth: 280, marginInline: "auto" }}
      />

      <Space size={4}>
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
            style={{ backgroundColor: "#1677FF", cursor: "pointer" }}
            size="small"
          >
            {user.name.charAt(0)}
          </Avatar>
        </Dropdown>
      </Space>
    </Flex>
  );
}
