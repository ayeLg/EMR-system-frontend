"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { App, Button, Flex, Form } from "antd";
import { FormTextArea } from "@/components/form/FormTextArea";
import { soapSchema, type SoapValues } from "../schemas";

export function SoapNote() {
  const { message } = App.useApp();
  const { control, handleSubmit } = useForm<SoapValues>({
    resolver: zodResolver(soapSchema),
    defaultValues: { subjective: "", objective: "", assessment: "", plan: "" },
  });

  const onSubmit = handleSubmit(() => {
    message.success("SOAP note saved (mock).");
  });

  return (
    <Form layout="vertical" onSubmitCapture={onSubmit}>
      <FormTextArea control={control} name="subjective" label="S — Subjective" placeholder="Chief complaint, history of present illness…" rows={3} />
      <FormTextArea control={control} name="objective" label="O — Objective" placeholder="Exam findings, vitals reference…" rows={3} />
      <FormTextArea control={control} name="assessment" label="A — Assessment" placeholder="Working diagnosis…" rows={3} />
      <FormTextArea control={control} name="plan" label="P — Plan" placeholder="Treatment, orders, follow-up…" rows={3} />
      <Flex justify="flex-end">
        <Button type="primary" htmlType="submit">
          Save note
        </Button>
      </Flex>
    </Form>
  );
}
