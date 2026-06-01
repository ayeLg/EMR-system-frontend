import { z } from "zod";
import dayjs, { type Dayjs } from "dayjs";

/** Quick schema (kept for the demo list / future inline use). */
export const patientSchema = z.object({
  fullName: z.string().min(1, "Required"),
  primaryPhone: z
    .string()
    .regex(/^(09\d{7,9}|\+959\d{7,9})$/, "Invalid Myanmar phone"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
});
export type PatientFormValues = z.infer<typeof patientSchema>;

/** Full patient registration schema (mirrors backend patient fields). */
export const registrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.custom<Dayjs>(
    (v) => dayjs.isDayjs(v),
    "Date of birth is required",
  ),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  nrcNumber: z.string().optional(),
  bloodType: z
    .enum([
      "A_POS",
      "A_NEG",
      "B_POS",
      "B_NEG",
      "AB_POS",
      "AB_NEG",
      "O_POS",
      "O_NEG",
      "UNKNOWN",
    ])
    .optional(),
  primaryPhone: z
    .string()
    .regex(/^(09\d{7,9}|\+959\d{7,9})$/, "Invalid Myanmar phone"),
  email: z.string().optional(),
  address: z.string().optional(),
  township: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  emergencyRelationship: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicy: z.string().optional(),
});
export type RegistrationValues = z.infer<typeof registrationSchema>;
