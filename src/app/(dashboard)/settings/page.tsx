"use client";

import { App, Button, Card, Form, Input, Segmented, Tabs, Typography } from "antd";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/ui/PageHeader";
import { useUIStore } from "@/store/ui-store";
import { usePermissions } from "@/lib/rbac/usePermissions";

const { Text } = Typography;

function ProfileTab() {
  const { user } = usePermissions();
  const { message } = App.useApp();
  return (
    <Card size="small" style={{ maxWidth: 520 }}>
      <Form
        layout="vertical"
        initialValues={{ fullName: user.name, role: user.role, email: "aung@hospital.mm" }}
        onFinish={() => message.success("Profile saved (mock).")}
      >
        <Form.Item name="fullName" label="Full name">
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Role">
          <Input disabled />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form>
    </Card>
  );
}

function PreferencesTab() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const locale = useUIStore((s) => s.locale);
  const setLocale = useUIStore((s) => s.setLocale);

  return (
    <Card size="small" style={{ maxWidth: 520 }}>
      <Form layout="vertical">
        <Form.Item label="Theme">
          <Segmented
            value={theme}
            onChange={(v) => setTheme(v as "light" | "dark")}
            options={[
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Language">
          <Segmented
            value={locale}
            onChange={(v) => setLocale(v as "en" | "my")}
            options={[
              { label: "English", value: "en" },
              { label: "မြန်မာ", value: "my" },
            ]}
          />
        </Form.Item>
      </Form>
    </Card>
  );
}

function SecurityTab() {
  const { message } = App.useApp();
  return (
    <Card size="small" style={{ maxWidth: 520 }}>
      <Form layout="vertical" onFinish={() => message.success("Password updated (mock).")}>
        <Form.Item label="Two-factor authentication">
          <Text type="success">● Enabled (TOTP)</Text>
        </Form.Item>
        <Form.Item name="current" label="Current password">
          <Input.Password />
        </Form.Item>
        <Form.Item name="next" label="New password">
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Update password
        </Button>
      </Form>
    </Card>
  );
}

export default function SettingsPage() {
  const t = useTranslations();
  return (
    <>
      <PageHeader title={t("nav.settings")} subtitle="Account & preferences" />
      <Tabs
        items={[
          { key: "profile", label: "Profile", children: <ProfileTab /> },
          { key: "preferences", label: "Preferences", children: <PreferencesTab /> },
          { key: "security", label: "Security", children: <SecurityTab /> },
        ]}
      />
    </>
  );
}
