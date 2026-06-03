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
import {
  BLOOD_TYPE_OPTIONS,
  GENDER_OPTIONS,
  RELATIONSHIP_OPTIONS,
} from "../options";

export function RegistrationForm({
  mode = "create",
  defaultValues,
}: {
  mode?: "create" | "edit";
  defaultValues?: Partial<RegistrationValues>;
} = {}) {
  const router = useRouter();
  const { message } = App.useApp();

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
      township: "",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelationship: undefined,
      insuranceProvider: "",
      insurancePolicy: "",
      ...defaultValues,
    },
  });

  const onSubmit = handleSubmit(() => {
    // UI-only: mock create, then go back to the list.
    message.success(
      mode === "edit" ? "Patient updated (mock)." : "Patient registered (mock). MRN generated.",
    );
    router.push(ROUTES.patients);
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
            <FormInput control={control} name="township" label="Township" placeholder="Township" />
          </Col>
          <Col xs={24}>
            <FormInput control={control} name="address" label="Address" placeholder="Home address" />
          </Col>
        </Row>
      </Card>

      <Card title="Emergency contact" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <FormInput control={control} name="emergencyName" label="Name" placeholder="Contact name" />
          </Col>
          <Col xs={24} md={8}>
            <FormInput control={control} name="emergencyPhone" label="Phone" placeholder="09XXXXXXXXX" />
          </Col>
          <Col xs={24} md={8}>
            <FormSelect control={control} name="emergencyRelationship" label="Relationship" placeholder="Select" options={RELATIONSHIP_OPTIONS} />
          </Col>
        </Row>
      </Card>

      <Card title="Insurance (optional)" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <FormInput control={control} name="insuranceProvider" label="Provider" placeholder="Insurance provider" />
          </Col>
          <Col xs={24} md={12}>
            <FormInput control={control} name="insurancePolicy" label="Policy number" placeholder="Policy number" />
          </Col>
        </Row>
      </Card>

      <Divider />
      <Flex justify="flex-end" gap={8}>
        <Button onClick={() => router.push(ROUTES.patients)}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          {mode === "edit" ? "Save changes" : "Register patient"}
        </Button>
      </Flex>
    </Form>
  );
}
