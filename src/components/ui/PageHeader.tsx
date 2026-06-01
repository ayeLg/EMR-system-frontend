"use client";

import { Flex, Typography } from "antd";
import type { ReactNode } from "react";

const { Title, Text } = Typography;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Flex
      justify="space-between"
      align="flex-start"
      style={{ marginBottom: 16 }}
      gap={12}
      wrap="wrap"
    >
      <div>
        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
        {subtitle ? (
          <Text type="secondary" style={{ fontSize: 13 }}>
            {subtitle}
          </Text>
        ) : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </Flex>
  );
}
