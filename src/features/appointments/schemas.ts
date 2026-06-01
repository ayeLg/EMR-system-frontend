import { z } from "zod";
import dayjs, { type Dayjs } from "dayjs";

export const bookingSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  departmentId: z.string().min(1, "Select a department"),
  doctorId: z.string().min(1, "Select a doctor"),
  scheduledAt: z.custom<Dayjs>(
    (v) => dayjs.isDayjs(v),
    "Date & time is required",
  ),
  type: z.enum(["OPD", "IPD", "FOLLOWUP", "EMERGENCY", "TELECONSULT"]),
  chiefComplaint: z.string().optional(),
});

export type BookingValues = z.infer<typeof bookingSchema>;
