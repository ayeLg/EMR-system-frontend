import { http } from "msw";
// Patients are fully bound to the live backend API — no mock handlers here, so
// /api/patients* requests pass through (onUnhandledRequest: "bypass") to NestJS.
import { MOCK_ENCOUNTERS, getMockEncounterDetail } from "@/lib/mock/encounters";
import { MOCK_PRESCRIPTIONS, MOCK_INVENTORY } from "@/lib/mock/pharmacy";
import { MOCK_LAB_ORDERS, getMockLabOrderDetail } from "@/lib/mock/laboratory";
import { MOCK_INVOICES, getMockInvoiceDetail } from "@/lib/mock/billing";
import { notFound, ok } from "./envelope";

export const handlers = [
  // http.get("/api/pharmacy/prescriptions", () => ok(MOCK_PRESCRIPTIONS)),
  // http.get("/api/pharmacy/inventory", () => ok(MOCK_INVENTORY)),
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
  
  // http.get("/api/appointments", () => ok(MOCK_APPOINTMENTS)),
  // http.get("/api/appointments/:id", ({ params }) => {
  //   const appt = MOCK_APPOINTMENTS.find((a) => a.id === String(params.id));
  //   return appt ? ok(appt) : notFound();
  // }),

  // http.get("/api/encounters", () => ok(MOCK_ENCOUNTERS)),
  // http.get("/api/encounters/:id", ({ params }) => {
  //   const detail = getMockEncounterDetail(String(params.id));
  //   return detail ? ok(detail) : notFound();
  // }),
  // http.post("/api/encounters/:id/vitals", ({ params }) =>
  //   ok({ id: `vitals-${String(params.id)}` }),
  // ),
  // http.post("/api/encounters/:id/notes", ({ params }) =>
  //   ok({ id: `note-${String(params.id)}` }),
  // ),
  // http.post("/api/encounters/:id/diagnoses", ({ params }) =>
  //   ok({ id: `diagnosis-${String(params.id)}` }),
  // ),
  // http.post("/api/encounters/:id/prescriptions", ({ params }) =>
  //   ok({ id: `rx-${String(params.id)}` }),
  // ),
  // http.post("/api/encounters/:id/lab-orders", ({ params }) =>
  //   ok({ id: `lab-${String(params.id)}` }),
  // ),
  // http.post("/api/encounters/:id/orders", ({ params }) =>
  //   ok({ id: `order-${String(params.id)}` }),
  // ),
  // http.patch("/api/encounters/:id/status", async ({ params, request }) => {
  //   const body = (await request.json()) as { status?: string };
  //   const encounter = MOCK_ENCOUNTERS.find((item) => item.id === String(params.id));
  //   return encounter
  //     ? ok({ ...encounter, status: body.status ?? encounter.status })
  //     : notFound();
  // }),
];
