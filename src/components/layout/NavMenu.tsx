"use client";

import { Menu } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { NAV_ITEMS, NAV_GROUP_ORDER } from "@/config/nav";
import { usePermissions } from "@/lib/rbac/usePermissions";

export function NavMenu({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tGroup = useTranslations("groups");
  const { can } = usePermissions();

  const items: MenuProps["items"] = NAV_GROUP_ORDER.map((group) => {
    const children = NAV_ITEMS.filter(
      (item) => item.group === group && can(item.permission),
    ).map((item) => ({
      key: item.path,
      icon: item.icon,
      label: (
        <Link href={item.path} onClick={onNavigate}>
          {tNav(item.labelKey)}
        </Link>
      ),
    }));

    if (children.length === 0) return null;

    return {
      key: `group-${group}`,
      type: "group" as const,
      label: tGroup(group),
      children,
    };
  }).filter((g): g is NonNullable<typeof g> => g !== null);

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      items={items}
      style={{ border: "none" }}
    />
  );
}
