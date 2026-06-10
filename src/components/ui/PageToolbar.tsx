"use client";

import { Flex } from "antd";
import type { ReactNode } from "react";

interface PageToolbarProps {
  search?: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
}

/** Search, filters, and inline actions above list/table content. */
export function PageToolbar({ search, filters, actions }: PageToolbarProps) {
  if (!search && !filters && !actions) return null;

  return (
    <Flex
      gap={12}
      wrap="wrap"
      align="center"
      justify="space-between"
      className="emr-page-toolbar"
    >
      <Flex gap={12} wrap="wrap" align="flex-end" style={{ flex: 1, minWidth: 0 }}>
        {search ? <div className="emr-toolbar-search-wrap">{search}</div> : null}
        {filters}
      </Flex>
      {actions ? (
        <Flex gap={8} wrap="wrap" align="center" className="emr-toolbar-actions-wrap">
          {actions}
        </Flex>
      ) : null}
    </Flex>
  );
}
