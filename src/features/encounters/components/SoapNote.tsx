"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { App, Button, Card, Flex, Form, Tag, Typography } from "antd";
import { useForm } from "react-hook-form";
import { FormTextArea } from "@/components/form/FormTextArea";
import { soapSchema, type SoapValues } from "../schemas";
import { useSaveSoapNote } from "../hooks/useEncounters";
import type { SoapNoteRecord } from "../types";

const { Text } = Typography;
const EMPTY: SoapValues = {
  subjective: "",
  objective: "",
  assessment: "",
  plan: "",
};

export function SoapNote({
  encounterId,
  notes = [],
  readOnly = false,
}: {
  encounterId: string;
  notes?: SoapNoteRecord[];
  readOnly?: boolean;
}) {
  const { message } = App.useApp();
  const saveSoap = useSaveSoapNote(encounterId);
  const [amendingId, setAmendingId] = useState<string | null>(null);
  const { control, handleSubmit, reset } = useForm<SoapValues>({
    resolver: zodResolver(soapSchema),
    defaultValues: EMPTY,
  });

  // Amendments never edit the original (immutable); they create a new linked note.
  const startAmend = (note: SoapNoteRecord) => {
    setAmendingId(note.id);
    reset({
      subjective: note.subjective,
      objective: note.objective,
      assessment: note.assessment,
      plan: note.plan,
    });
  };
  const cancelAmend = () => {
    setAmendingId(null);
    reset(EMPTY);
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      await saveSoap.mutateAsync({
        ...values,
        amendedFrom: amendingId ?? undefined,
      });
      message.success(amendingId ? "SOAP note amended." : "SOAP note saved.");
      cancelAmend();
    } catch (err) {
      const apiErr = err as { message?: string };
      message.error(apiErr.message ?? "Failed to save SOAP note");
    }
  });

  return (
    <Flex vertical gap={16}>
      {notes.length > 0 ? (
        <Card size="small" title={`Note history (${notes.length})`}>
          <Flex vertical gap={12}>
            {notes.map((note) => (
              <div key={note.id}>
                <Flex justify="space-between" align="center">
                  <Text strong>
                    {new Date(note.createdAt).toLocaleString()}
                  </Text>
                  <Flex gap={8} align="center">
                    {note.isAmended ? <Tag color="gold">Amendment</Tag> : null}
                    {readOnly ? null : (
                      <Button size="small" onClick={() => startAmend(note)}>
                        Amend
                      </Button>
                    )}
                  </Flex>
                </Flex>
                <Text
                  type="secondary"
                  style={{ whiteSpace: "pre-wrap", display: "block" }}
                >
                  {`S: ${note.subjective}\nO: ${note.objective}\nA: ${note.assessment}\nP: ${note.plan}`}
                </Text>
              </div>
            ))}
          </Flex>
        </Card>
      ) : null}

      {readOnly ? null : (
        <Card
          size="small"
          title={
            amendingId ? "Amend note (saves a new version)" : "New SOAP note"
          }
        >
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
            <Flex justify="flex-end" gap={8}>
              {amendingId ? (
                <Button onClick={cancelAmend}>Cancel</Button>
              ) : null}
              <Button
                type="primary"
                htmlType="submit"
                loading={saveSoap.isPending}
              >
                {amendingId ? "Save amendment" : "Save note"}
              </Button>
            </Flex>
          </Form>
        </Card>
      )}
    </Flex>
  );
}
