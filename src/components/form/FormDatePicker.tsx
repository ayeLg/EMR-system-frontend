"use client";

import { DatePicker, Form } from "antd";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

interface FormDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  showTime?: boolean;
}

export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  showTime = false,
}: FormDatePickerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          validateStatus={fieldState.error ? "error" : undefined}
          help={fieldState.error?.message}
          style={{ marginBottom: 16 }}
        >
          <DatePicker
            value={field.value ?? null}
            onChange={field.onChange}
            placeholder={placeholder}
            style={{ width: "100%" }}
            showTime={showTime}
            format={showTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD"}
          />
        </Form.Item>
      )}
    />
  );
}
