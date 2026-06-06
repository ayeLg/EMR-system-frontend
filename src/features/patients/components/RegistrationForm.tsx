"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { App, Button, Card, Col, Divider, Flex, Form, Row } from "antd";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormDatePicker } from "@/components/form/FormDatePicker";
import { ROUTES } from "@/config/routes";
import { registrationSchema, type RegistrationValues } from "../schemas";
import { toCreatePayload } from "../mappers";
import {
  useCreatePatient,
  useUpdatePatient,
} from "../hooks/usePatientMutations";
import { BLOOD_TYPE_OPTIONS, GENDER_OPTIONS } from "../options";

interface ApiError {
  message?: string;
}

export function RegistrationForm({
  mode = "create",
  patientId,
  defaultValues,
}: {
  mode?: "create" | "edit";
  patientId?: string;
  defaultValues?: Partial<RegistrationValues>;
} = {}) {
  const router = useRouter();
  const { message } = App.useApp();

  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient(patientId ?? "");
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const { control, handleSubmit } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      nrcNumber: "",
      bloodType: "UNKNOWN",
      primaryPhone: "",
      email: "",
      address: "",
      city: "",
      township: "",
      ...defaultValues,
    },
  });

  const onSubmit = handleSubmit((values) => {
    const payload = toCreatePayload(values);

    if (mode === "edit") {
      if (!patientId) {
        message.error("Missing patient id.");
        return;
      }
      updateMutation.mutate(payload, {
        onSuccess: () => {
          message.success("Patient updated.");
          router.push(`${ROUTES.patients}/${patientId}`);
        },
        onError: (error: unknown) => {
          message.error(
            (error as ApiError)?.message ?? "Failed to update patient.",
          );
        },
      });
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: (patient) => {
        message.success(`Patient registered. ${patient.mrn} generated.`);
        router.push(ROUTES.patients);
      },
      onError: (error: unknown) => {
        message.error(
          (error as ApiError)?.message ?? "Failed to register patient.",
        );
      },
    });
  });

  return (
    <Form layout="vertical" onSubmitCapture={onSubmit}>
      <Card title="Demographics" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <FormInput control={control} name="firstName" label="First name" placeholder="First name" />
          </Col>
          <Col xs={24} md={12}>
            <FormInput control={control} name="lastName" label="Last name" placeholder="Last name" />
          </Col>
          <Col xs={24} md={8}>
            <FormDatePicker control={control} name="dateOfBirth" label="Date of birth" placeholder="YYYY-MM-DD" />
          </Col>
          <Col xs={24} md={8}>
            <FormSelect control={control} name="gender" label="Gender" placeholder="Select" options={GENDER_OPTIONS} />
          </Col>
          <Col xs={24} md={8}>
            <FormSelect control={control} name="bloodType" label="Blood type" placeholder="Select" options={BLOOD_TYPE_OPTIONS} />
          </Col>
          <Col xs={24} md={12}>
            <FormInput control={control} name="nrcNumber" label="NRC number" placeholder="e.g. 12/ABC(N)123456" />
          </Col>
        </Row>
      </Card>

      <Card title="Contact" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <FormInput control={control} name="primaryPhone" label="Primary phone" placeholder="09XXXXXXXXX" />
          </Col>
          <Col xs={24} md={8}>
            <FormInput control={control} name="email" label="Email" placeholder="name@example.com" />
          </Col>
          <Col xs={24} md={8}>
            <FormInput control={control} name="city" label="City" placeholder="City" />
          </Col>
          <Col xs={24} md={8}>
            <FormInput control={control} name="township" label="Township" placeholder="Township" />
          </Col>
          <Col xs={24} md={16}>
            <FormInput control={control} name="address" label="Address" placeholder="Home address" />
          </Col>
        </Row>
      </Card>

      <Divider />
      <Flex justify="flex-end" gap={8}>
        <Button onClick={() => router.push(ROUTES.patients)} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          {mode === "edit" ? "Save changes" : "Register patient"}
        </Button>
      </Flex>
    </Form>
  );
}
