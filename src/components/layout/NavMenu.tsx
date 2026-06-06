"use client";

import { Menu } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { NAV_ITEMS, NAV_GROUP_ORDER } from "@/config/nav";
import { usePermissions } from "@/lib/rbac/usePermissions";

export function NavMenu({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tGroup = useTranslations("groups");
  const { can } = usePermissions();

  const visibleItems = NAV_ITEMS.filter((item) => can(item.permission));

  const toMenuItem = (item: (typeof NAV_ITEMS)[number]) => ({
    key: item.path,
    icon: item.icon,
    title: tNav(item.labelKey),
    label: (
      <Link href={item.path} onClick={onNavigate}>
        {tNav(item.labelKey)}
      </Link>
    ),
  });

  const items: MenuProps["items"] = collapsed
    ? visibleItems.map(toMenuItem)
    : NAV_GROUP_ORDER.map((group) => {
        const children = visibleItems
          .filter((item) => item.group === group)
          .map(toMenuItem);

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
      inlineCollapsed={collapsed}
      selectedKeys={[pathname]}
      items={items}
      style={{ border: "none" }}
    />
  );
}
