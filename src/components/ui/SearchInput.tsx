"use client";

import { Input } from "antd";
import type { InputProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export interface SearchInputProps extends Omit<InputProps, "prefix"> {
  /** When true, uses a wider field suited for page toolbars. */
  wide?: boolean;
}

export function SearchInput({
  wide,
  allowClear = true,
  variant = "filled",
  size = "middle",
  style,
  ...props
}: SearchInputProps) {
  return (
    <Input
      allowClear={allowClear}
      variant={variant}
      size={size}
      prefix={<SearchOutlined style={{ color: "var(--emr-text-muted)" }} />}
      className="emr-search-input"
      style={{
        flex: wide ? "1 1 280px" : undefined,
        maxWidth: wide ? 420 : 320,
        borderRadius: 10,
        ...style,
      }}
      {...props}
    />
  );
}
