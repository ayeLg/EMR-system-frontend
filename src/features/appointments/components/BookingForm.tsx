"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { App, Button, Card, Col, Divider, Flex, Form, Row } from "antd";
import { FormSelect } from "@/components/form/FormSelect";
import { FormDatePicker } from "@/components/form/FormDatePicker";
import { FormTextArea } from "@/components/form/FormTextArea";
import { ROUTES } from "@/config/routes";
import { bookingSchema, type BookingValues } from "../schemas";
import {
  DEPARTMENT_OPTIONS,
  DOCTOR_OPTIONS,
  PATIENT_OPTIONS,
  TYPE_OPTIONS,
} from "../constants";

export function BookingForm() {
  const router = useRouter();
  const { message } = App.useApp();

  const { control, handleSubmit } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      patientId: undefined,
      departmentId: undefined,
      doctorId: undefined,
      type: undefined,
      chiefComplaint: "",
    },
  });

  const onSubmit = handleSubmit(() => {
    message.success("Appointment booked (mock). SMS + in-app reminder queued.");
    router.push(ROUTES.appointments);
  });

  return (
    <Form layout="vertical" onSubmitCapture={onSubmit}>
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <FormSelect control={control} name="patientId" label="Patient" placeholder="Select patient" options={PATIENT_OPTIONS} />
          </Col>
          <Col xs={24} md={12}>
            <FormSelect control={control} name="type" label="Visit type" placeholder="Select type" options={TYPE_OPTIONS} />
          </Col>
          <Col xs={24} md={12}>
            <FormSelect control={control} name="departmentId" label="Department" placeholder="Select department" options={DEPARTMENT_OPTIONS} />
          </Col>
          <Col xs={24} md={12}>
            <FormSelect control={control} name="doctorId" label="Doctor" placeholder="Select doctor" options={DOCTOR_OPTIONS} />
          </Col>
          <Col xs={24} md={12}>
            <FormDatePicker control={control} name="scheduledAt" label="Date & time" placeholder="Select date & time" showTime />
          </Col>
          <Col xs={24}>
            <FormTextArea control={control} name="chiefComplaint" label="Chief complaint" placeholder="Reason for visit" />
          </Col>
        </Row>
      </Card>

      <Divider />
      <Flex justify="flex-end" gap={8}>
        <Button onClick={() => router.push(ROUTES.appointments)}>Cancel</Button>
        <Button type="primary" htmlType="submit">
          Book appointment
        </Button>
      </Flex>
    </Form>
  );
}
