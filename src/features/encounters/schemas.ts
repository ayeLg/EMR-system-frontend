import { z } from "zod";

const soapField = z.string().min(10, "Minimum 10 characters");

export const soapSchema = z.object({
  subjective: soapField,
  objective: soapField,
  assessment: soapField,
  plan: soapField,
});

export type SoapValues = z.infer<typeof soapSchema>;

export const vitalsSchema = z.object({
  systolicBp: z.coerce.number().min(0).max(300).optional(),
  diastolicBp: z.coerce.number().min(0).max(200).optional(),
  heartRate: z.coerce.number().min(0).max(300).optional(),
  temperature: z.coerce.number().min(25).max(45).optional(),
  oxygenSaturation: z.coerce.number().min(0).max(100).optional(),
  weightKg: z.coerce.number().min(0).max(400).optional(),
});

export type VitalsValues = z.infer<typeof vitalsSchema>;
