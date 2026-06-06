import { describe, expect, it } from "vitest";
import dayjs from "dayjs";
import {
  mapApiPatientToDetail,
  mapApiPatientToPatient,
  toCreatePayload,
} from "./mappers";
import type { ApiPatient, ApiPatientDetail } from "./api/backend-types";
import type { RegistrationValues } from "./schemas";

const apiPatient: ApiPatient = {
  id: "p1",
  mrn: "MRN-0000043",
  firstName: "Aung",
  lastName: "Min",
  dateOfBirth: "1990-01-01",
  gender: "MALE",
  bloodType: "O_POS",
  primaryPhone: "09771234567",
  isActive: true,
  createdAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
};

describe("patient mappers", () => {
  it("maps an API patient to the list shape with derived fullName and status", () => {
    const patient = mapApiPatientToPatient(apiPatient);
    expect(patient).toEqual({
      id: "p1",
      mrn: "MRN-0000043",
      fullName: "Aung Min",
      primaryPhone: "09771234567",
      gender: "MALE",
      status: "ACTIVE",
    });
  });

  it("maps isActive=false to INACTIVE status", () => {
    expect(mapApiPatientToPatient({ ...apiPatient, isActive: false }).status).toBe(
      "INACTIVE",
    );
  });

  it("maps detail with allergies and recent encounters", () => {
    const detail: ApiPatientDetail = {
      ...apiPatient,
      city: "Yangon",
      township: "Sanchaung",
      allergies: [
        {
          id: "a1",
          allergenType: "DRUG",
          allergenName: "Penicillin",
          severity: "SEVERE",
          reaction: "Anaphylaxis",
        },
      ],
      recentEncounters: [
        {
          id: "e1",
          encounterNo: "ENC-0200102",
          date: "2026-05-20",
          type: "OPD",
          status: "COMPLETED",
        },
      ],
    };

    const mapped = mapApiPatientToDetail(detail);
    expect(mapped.city).toBe("Yangon");
    expect(mapped.bloodType).toBe("O_POS");
    expect(mapped.allergies).toHaveLength(1);
    expect(mapped.allergies[0].reaction).toBe("Anaphylaxis");
    expect(mapped.recentEncounters[0].doctor).toBe("—");
  });

  it("builds a create payload, formatting the date and dropping empty optionals", () => {
    const values: RegistrationValues = {
      firstName: " Aung ",
      lastName: "Min",
      dateOfBirth: dayjs("1990-01-01"),
      gender: "MALE",
      nrcNumber: "",
      bloodType: "O_POS",
      primaryPhone: "09771234567",
      email: "",
      address: "",
      city: "Yangon",
      township: "",
    };

    const payload = toCreatePayload(values);
    expect(payload).toEqual({
      firstName: "Aung",
      lastName: "Min",
      dateOfBirth: "1990-01-01",
      gender: "MALE",
      nrcNumber: undefined,
      bloodType: "O_POS",
      primaryPhone: "09771234567",
      email: undefined,
      address: undefined,
      city: "Yangon",
      township: undefined,
    });
    expect("mrn" in payload).toBe(false);
  });
});
