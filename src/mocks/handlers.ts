import { http } from "msw";
import {
  MOCK_PATIENTS,
  addMockPatient,
  getMockPatientDetail,
  removeMockPatient,
  updateMockPatient,
} from "@/lib/mock/patients";
import type {
  CreatePatientPayload,
  UpdatePatientPayload,
} from "@/features/patients/api/backend-types";
import { MOCK_APPOINTMENTS } from "@/lib/mock/appointments";
import { MOCK_ENCOUNTERS, getMockEncounterDetail } from "@/lib/mock/encounters";
import { MOCK_PRESCRIPTIONS, MOCK_INVENTORY } from "@/lib/mock/pharmacy";
import { MOCK_LAB_ORDERS, getMockLabOrderDetail } from "@/lib/mock/laboratory";
import { MOCK_INVOICES, getMockInvoiceDetail } from "@/lib/mock/billing";
import { MOCK_STAFF } from "@/lib/mock/users";
import { notFound, ok } from "./envelope";

export const handlers = [
  http.get("/api/pharmacy/prescriptions", () => ok(MOCK_PRESCRIPTIONS)),
  http.get("/api/pharmacy/inventory", () => ok(MOCK_INVENTORY)),
  http.get("/api/lab/orders", () => ok(MOCK_LAB_ORDERS)),
  http.get("/api/lab/orders/:id", ({ params }) => {
    const detail = getMockLabOrderDetail(String(params.id));
    return detail ? ok(detail) : notFound();
  }),
  http.get("/api/billing/invoices", () => ok(MOCK_INVOICES)),
  http.get("/api/billing/invoices/:id", ({ params }) => {
    const detail = getMockInvoiceDetail(String(params.id));
    return detail ? ok(detail) : notFound();
  }),
  http.get("/api/appointments", () => ok(MOCK_APPOINTMENTS)),
  http.get("/api/appointments/:id", ({ params }) => {
    const appt = MOCK_APPOINTMENTS.find((a) => a.id === String(params.id));
    return appt ? ok(appt) : notFound();
  }),
  http.get("/api/encounters", () => ok(MOCK_ENCOUNTERS)),
  http.get("/api/encounters/:id", ({ params }) => {
    const detail = getMockEncounterDetail(String(params.id));
    return detail ? ok(detail) : notFound();
  }),
  http.get("/api/patients", () =>
    ok(MOCK_PATIENTS.filter((p) => p.isActive)),
  ),
  http.get("/api/patients/:id", ({ params }) => {
    const detail = getMockPatientDetail(String(params.id));
    return detail ? ok(detail) : notFound();
  }),
  http.post("/api/patients", async ({ request }) => {
    const payload = (await request.json()) as CreatePatientPayload;
    return ok(addMockPatient(payload));
  }),
  http.patch("/api/patients/:id", async ({ params, request }) => {
    const payload = (await request.json()) as UpdatePatientPayload;
    const updated = updateMockPatient(String(params.id), payload);
    return updated ? ok(updated) : notFound();
  }),
  http.delete("/api/patients/:id", ({ params }) => {
    const removed = removeMockPatient(String(params.id));
    return removed ? ok({ deleted: true }) : notFound();
  }),
  http.get("/api/users", () => ok(MOCK_STAFF)),
];
