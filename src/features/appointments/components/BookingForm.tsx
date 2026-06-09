"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { App, Button, Card, Col, Divider, Flex, Form, Row } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { FormSelect } from "@/components/form/FormSelect";
import { FormDatePicker } from "@/components/form/FormDatePicker";
import { FormTextArea } from "@/components/form/FormTextArea";
import { ROUTES } from "@/config/routes";
import { useDepartments } from "@/features/master-data/hooks/useDepartments";
import { usePatients } from "@/features/patients/hooks/usePatients";
import { useStaff } from "@/features/users/hooks/useStaff";
import { bookingSchema, type BookingValues } from "../schemas";
import { TYPE_OPTIONS } from "../constants";
import { useCreateAppointment } from "../hooks/useAppointments";

export function BookingForm() {
  const router = useRouter();
  const { message } = App.useApp();
  const createAppointment = useCreateAppointment();
  const { data: patients = [], isLoading: loadingPatients } = usePatients();
  const { data: departments = [], isLoading: loadingDepartments } =
    useDepartments();
  const { data: staff = [], isLoading: loadingStaff } = useStaff();

  const { control, handleSubmit, watch } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      patientId: undefined,
      departmentId: undefined,
      doctorId: undefined,
      type: undefined,
      chiefComplaint: "",
    },
  });

  const selectedDoctorId = watch("doctorId");
  const selectedDoctor = useMemo(
    () => staff.find((u) => u.id === selectedDoctorId),
    [staff, selectedDoctorId],
  );

  const disabledDate = (current: Dayjs) => {
    if (!current) return false;

    // Disable past dates
    const isPast = current.isBefore(dayjs().startOf("day"));
    if (isPast) return true;

    // Filter by doctor schedule working days
    if (!selectedDoctor?.schedules || selectedDoctor.schedules.length === 0) {
      return false;
    }

    const workingDays = selectedDoctor.schedules.map((s) => s.dayOfWeek);
    return !workingDays.includes(current.day());
  };

  const disabledTime = (currentDate: Dayjs) => {
    if (
      !currentDate ||
      !selectedDoctor?.schedules ||
      selectedDoctor.schedules.length === 0
    ) {
      return {};
    }

    const day = currentDate.day();
    const activeSchedulesForDay = selectedDoctor.schedules.filter(
      (s) => s.dayOfWeek === day,
    );

    if (activeSchedulesForDay.length === 0) {
      return {
        disabledHours: () => Array.from({ length: 24 }, (_, i) => i),
        disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i),
      };
    }

    const validHours = new Set<number>();
    const hourToMinutes = new Map<number, Set<number>>();

    for (const schedule of activeSchedulesForDay) {
      const [startH, startM] = schedule.startTime.split(":").map(Number);
      const [endH, endM] = schedule.endTime.split(":").map(Number);

      for (let h = startH; h <= endH; h++) {
        validHours.add(h);
        const minutesSet = hourToMinutes.get(h) || new Set<number>();

        const minStart = h === startH ? startM : 0;
        const minEnd = h === endH ? endM : 59;

        for (let m = minStart; m <= minEnd; m++) {
          minutesSet.add(m);
        }
        hourToMinutes.set(h, minutesSet);
      }
    }

    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => i).filter((h) => !validHours.has(h)),
      disabledMinutes: (selectedHour: number) => {
        const validMins = hourToMinutes.get(selectedHour);
        if (!validMins) return Array.from({ length: 60 }, (_, i) => i);
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (m) => !validMins.has(m),
        );
      },
    };
  };

  const patientOptions = useMemo(
    () =>
      patients.map((patient) => ({
        label: `${patient.fullName} - ${patient.mrn}`,
        value: patient.id,
      })),
    [patients],
  );

  const departmentOptions = useMemo(
    () =>
      departments
        .filter((department) => department.isActive !== false)
        .map((department) => ({
          label: String(department.name ?? department.code ?? department.id),
          value: department.id,
        })),
    [departments],
  );

  const doctorOptions = useMemo(
    () =>
      staff
        .filter((user) => user.status === "ACTIVE")
        .filter((user) => user.role.toLowerCase().includes("doctor"))
        .map((doctor) => ({
          label: doctor.fullName,
          value: doctor.id,
        })),
    [staff],
  );

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createAppointment.mutateAsync({
        patientId: values.patientId,
        departmentId: values.departmentId,
        doctorId: values.doctorId,
        scheduledAt: values.scheduledAt.toISOString(),
        type: values.type,
        chiefComplaint: values.chiefComplaint?.trim() || undefined,
      });
      message.success("Appointment booked.");
      router.push(ROUTES.appointments);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      message.error(apiErr.message || "Failed to book appointment.");
    }
  });

  const isLoadingOptions =
    loadingPatients || loadingDepartments || loadingStaff;

  return (
    <Form layout="vertical" onSubmitCapture={onSubmit}>
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <FormSelect
              control={control}
              name="patientId"
              label="Patient"
              placeholder={loadingPatients ? "Loading patients" : "Select patient"}
              options={patientOptions}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormSelect
              control={control}
              name="type"
              label="Visit type"
              placeholder="Select type"
              options={TYPE_OPTIONS}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormSelect
              control={control}
              name="departmentId"
              label="Department"
              placeholder={
                loadingDepartments ? "Loading departments" : "Select department"
              }
              options={departmentOptions}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormSelect
              control={control}
              name="doctorId"
              label="Doctor"
              placeholder={loadingStaff ? "Loading doctors" : "Select doctor"}
              options={doctorOptions}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormDatePicker
              control={control}
              name="scheduledAt"
              label="Date & time"
              placeholder="Select date & time"
              showTime
              disabledDate={disabledDate}
              disabledTime={disabledTime}
            />
          </Col>
          <Col xs={24}>
            <FormTextArea
              control={control}
              name="chiefComplaint"
              label="Chief complaint"
              placeholder="Reason for visit"
            />
          </Col>
        </Row>
      </Card>

      <Divider />
      <Flex justify="flex-end" gap={8}>
        <Button
          disabled={createAppointment.isPending}
          onClick={() => router.push(ROUTES.appointments)}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={createAppointment.isPending}
          disabled={isLoadingOptions}
        >
          Book appointment
        </Button>
      </Flex>
    </Form>
  );
}
