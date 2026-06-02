"use client";

import { Select } from "antd";
import type { SelectProps } from "antd";
import { FilterOutlined } from "@ant-design/icons";

export interface FilterSelectProps extends SelectProps {
  /** Small caption above the control (toolbar filters). */
  label?: string;
  /** Show filter icon inside the selector. */
  showFilterIcon?: boolean;
}

/** Toolbar filter select — matches SearchInput height and filled style. */
export function FilterSelect({
  label,
  showFilterIcon = true,
  allowClear = true,
  variant = "filled",
  size = "middle",
  className,
  style,
  ...props
}: FilterSelectProps) {
  const select = (
    <Select
      allowClear={allowClear}
      variant={variant}
      size={size}
      className={["emr-filter-select", className].filter(Boolean).join(" ")}
      prefix={
        showFilterIcon ? (
          <FilterOutlined style={{ color: "var(--emr-text-muted)", marginInlineEnd: 4 }} />
        ) : undefined
      }
      style={{ minWidth: 168, ...style }}
      popupClassName="emr-filter-select-dropdown"
      {...props}
    />
  );

  if (!label) return select;

  return (
    <label className="emr-filter-field">
      <span className="emr-filter-field__label">{label}</span>
      {select}
    </label>
  );
}
