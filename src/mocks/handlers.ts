import { http, HttpResponse } from "msw";
import { MOCK_PATIENTS, getMockPatientDetail } from "@/lib/mock/patients";
import { MOCK_APPOINTMENTS } from "@/lib/mock/appointments";
import { MOCK_ENCOUNTERS, getMockEncounterDetail } from "@/lib/mock/encounters";
import { MOCK_PRESCRIPTIONS, MOCK_INVENTORY } from "@/lib/mock/pharmacy";
import { MOCK_LAB_ORDERS, getMockLabOrderDetail } from "@/lib/mock/laboratory";
import { MOCK_INVOICES, getMockInvoiceDetail } from "@/lib/mock/billing";
import { MOCK_STAFF } from "@/lib/mock/users";
import { MOCK_USER } from "@/lib/rbac/mock-user";

export const handlers = [
  http.get("/api/pharmacy/prescriptions", () => HttpResponse.json(MOCK_PRESCRIPTIONS)),
  http.get("/api/pharmacy/inventory", () => HttpResponse.json(MOCK_INVENTORY)),
  http.get("/api/lab/orders", () => HttpResponse.json(MOCK_LAB_ORDERS)),
  http.get("/api/lab/orders/:id", ({ params }) => {
    const detail = getMockLabOrderDetail(String(params.id));
    return detail ? HttpResponse.json(detail) : new HttpResponse(null, { status: 404 });
  }),
  http.get("/api/billing/invoices", () => HttpResponse.json(MOCK_INVOICES)),
  http.get("/api/billing/invoices/:id", ({ params }) => {
    const detail = getMockInvoiceDetail(String(params.id));
    return detail ? HttpResponse.json(detail) : new HttpResponse(null, { status: 404 });
  }),
  http.get("/api/appointments", () => HttpResponse.json(MOCK_APPOINTMENTS)),
  http.get("/api/appointments/:id", ({ params }) => {
    const appt = MOCK_APPOINTMENTS.find((a) => a.id === String(params.id));
    return appt ? HttpResponse.json(appt) : new HttpResponse(null, { status: 404 });
  }),
  http.get("/api/encounters", () => HttpResponse.json(MOCK_ENCOUNTERS)),
  http.get("/api/encounters/:id", ({ params }) => {
    const detail = getMockEncounterDetail(String(params.id));
    return detail
      ? HttpResponse.json(detail)
      : new HttpResponse(null, { status: 404 });
  }),
  http.get("/api/patients", () => HttpResponse.json(MOCK_PATIENTS)),
  http.get("/api/patients/:id", ({ params }) => {
    const detail = getMockPatientDetail(String(params.id));
    return detail
      ? HttpResponse.json(detail)
      : new HttpResponse(null, { status: 404 });
  }),
  http.get("/api/users", () => HttpResponse.json(MOCK_STAFF)),
  http.get("/api/me", () => HttpResponse.json(MOCK_USER)),
];
