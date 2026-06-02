"use client";

import { Button } from "antd";
import type { ButtonProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

type CreateButtonProps = ButtonProps;

/** Primary call-to-action for “create / register / book” flows. */
export function CreateButton({ children, icon, ...props }: CreateButtonProps) {
  return (
    <Button
      type="primary"
      size="middle"
      icon={icon ?? <PlusOutlined />}
      className="emr-create-btn"
      {...props}
    >
      {children}
    </Button>
  );
}
