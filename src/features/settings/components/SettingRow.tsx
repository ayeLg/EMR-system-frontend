"use client";

import { Typography } from "antd";
import type { ReactNode } from "react";

const { Text } = Typography;

export function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="emr-settings-row">
      <div className="emr-settings-row__meta">
        <Text strong>{title}</Text>
        {description ? (
          <Text type="secondary" className="emr-settings-row__desc">
            {description}
          </Text>
        ) : null}
      </div>
      <div className="emr-settings-row__control">{children}</div>
    </div>
  );
}
