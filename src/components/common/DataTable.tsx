"use client";

import { Table } from "antd";
import type { TableProps } from "antd";

/**
 * Thin wrapper over AntD Table with compact, EMR-friendly defaults.
 * Pass `rowKey`, `columns`, `dataSource`, `loading` as usual.
 */
export function DataTable<T extends object>(props: TableProps<T>) {
  return (
    <Table<T>
      size="small"
      bordered
      pagination={{ pageSize: 10, hideOnSinglePage: true, size: "small" }}
      scroll={{ x: "max-content" }}
      {...props}
    />
  );
}
