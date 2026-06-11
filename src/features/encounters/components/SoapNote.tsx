"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { App, Button, Flex, Form } from "antd";
import { useForm } from "react-hook-form";
import { FormTextArea } from "@/components/form/FormTextArea";
import { soapSchema, type SoapValues } from "../schemas";
import { useSaveSoapNote } from "../hooks/useEncounters";

export function SoapNote({ encounterId }: { encounterId: string }) {
  const { message } = App.useApp();
  const saveSoap = useSaveSoapNote(encounterId);
  const { control, handleSubmit } = useForm<SoapValues>({
    resolver: zodResolver(soapSchema),
    defaultValues: { subjective: "", objective: "", assessment: "", plan: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    await saveSoap.mutateAsync(values);
    message.success("SOAP note saved.");
  });

  return (
    <Form layout="vertical" onSubmitCapture={onSubmit}>
      <FormTextArea
        control={control}
        name="subjective"
        label="S - Subjective"
        placeholder="Chief complaint, history of present illness..."
        rows={3}
      />
      <FormTextArea
        control={control}
        name="objective"
        label="O - Objective"
        placeholder="Exam findings, vitals reference..."
        rows={3}
      />
      <FormTextArea
        control={control}
        name="assessment"
        label="A - Assessment"
        placeholder="Working diagnosis..."
        rows={3}
      />
      <FormTextArea
        control={control}
        name="plan"
        label="P - Plan"
        placeholder="Treatment, orders, follow-up..."
        rows={3}
      />
      <Flex justify="flex-end">
        <Button type="primary" htmlType="submit" loading={saveSoap.isPending}>
          Save note
        </Button>
      </Flex>
    </Form>
  );
}
