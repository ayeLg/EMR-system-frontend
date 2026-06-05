"use client";

import { useMemo, useState } from "react";
import { App, Checkbox, Select, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ContentCard } from "@/components/ui/ContentCard";
import {
  CRUD_COLUMNS,
  RBAC_MODULES,
  permissionKey,
  type CrudAction,
} from "../rbac-modules";
import { useRbacPermissions, useRbacRoles, useSetRolePermissions } from "../hooks/useRbac";
import type { RbacPermission, RbacRole } from "../types";

const { Text } = Typography;

type ModuleRow = (typeof RBAC_MODULES)[number];

export function RbacMatrix() {
  const { message } = App.useApp();
  const { data: permissions = [], isLoading: loadingPerms } = useRbacPermissions();
  const { data: roles = [], isLoading: loadingRoles } = useRbacRoles();
  const setPermissions = useSetRolePermissions();
  const [pendingCell, setPendingCell] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>();

  const permissionByKey = useMemo(() => {
    const map = new Map<string, RbacPermission>();
    for (const p of permissions) {
      map.set(p.key, p);
    }
    return map;
  }, [permissions]);

  const activeRoleId = selectedRoleId ?? roles[0]?.id;
  const activeRole = roles.find((r) => r.id === activeRoleId);

  const permissionIdsByRole = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const role of roles) {
      map.set(role.id, new Set(role.permissions.map((p) => p.id)));
    }
    return map;
  }, [roles]);

  const togglePermission = async (
    role: RbacRole,
    permission: RbacPermission,
    enabled: boolean,
  ) => {
    if (role.code === "SUPER_ADMIN") {
      message.warning("Super Admin always has full access.");
      return;
    }

    const cellKey = `${role.id}:${permission.id}`;
    setPendingCell(cellKey);

    const current = permissionIdsByRole.get(role.id) ?? new Set<string>();
    const next = new Set(current);
    if (enabled) {
      next.add(permission.id);
    } else {
      next.delete(permission.id);
    }

    try {
      await setPermissions.mutateAsync({
        roleId: role.id,
        permissionIds: [...next],
      });
    } catch (err) {
      const apiErr = err as { message?: string };
      message.error(apiErr.message ?? "Failed to update role");
    } finally {
      setPendingCell(null);
    }
  };

  const columns: ColumnsType<ModuleRow> = [
    {
      title: "Resource",
      key: "resource",
      fixed: "left",
      width: 220,
      render: (_, row) => <Text strong>{row.label}</Text>,
    },
    ...CRUD_COLUMNS.map((col) => ({
      title: col.label,
      key: col.action,
      align: "center" as const,
      width: 100,
      render: (_: unknown, row: ModuleRow) => {
        if (!activeRole) return null;

        const key = permissionKey(row.module, col.action as CrudAction);
        const permission = permissionByKey.get(key);
        if (!permission) {
          return <Text type="secondary">—</Text>;
        }

        const checked =
          permissionIdsByRole.get(activeRole.id)?.has(permission.id) ?? false;
        const cellKey = `${activeRole.id}:${permission.id}`;
        const locked = activeRole.code === "SUPER_ADMIN";

        return (
          <Checkbox
            checked={locked ? true : checked}
            disabled={locked}
            onChange={(e) =>
              void togglePermission(activeRole, permission, e.target.checked)
            }
            aria-label={`${row.label} ${col.label}`}
            style={{
              opacity: pendingCell === cellKey ? 0.5 : 1,
              pointerEvents: pendingCell === cellKey ? "none" : undefined,
            }}
          />
        );
      },
    })),
  ];

  return (
    <ContentCard>
      <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
        <div>
          <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
            Role
          </Text>
          <Select
            style={{ minWidth: 280 }}
            placeholder="Select role"
            loading={loadingRoles}
            value={activeRoleId}
            onChange={setSelectedRoleId}
            options={roles.map((role) => ({
              value: role.id,
              label: `${role.name} (${role.code})`,
            }))}
          />
        </div>
        {activeRole && activeRole.userCount > 0 ? (
          <Text type="secondary">{activeRole.userCount} users with this role</Text>
        ) : null}
      </div>

      <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
        Use checkboxes to grant List (read), Create, Edit (update), and Delete per resource.
        Changes apply after users sign in again or refresh their session.
      </Text>

      <Table<ModuleRow>
        rowKey="module"
        size="middle"
        bordered
        loading={loadingPerms || loadingRoles}
        columns={columns}
        dataSource={[...RBAC_MODULES]}
        pagination={false}
      />

      <div style={{ marginTop: 12 }}>
        <Tag>SUPER_ADMIN</Tag>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {" "}
          is locked to all permissions (server-enforced).
        </Text>
      </div>
    </ContentCard>
  );
}
