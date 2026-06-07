export interface DoctorSchedule {
  id: string;
  doctorId: string;
  doctorName: string;
  dayOfWeek: number;
  dayLabel: string;
  startTime: string;
  endTime: string;
  slotMinutes: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string | null;
}

export interface DoctorSchedulePayload {
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotMinutes: number;
  validFrom?: string;
  validUntil?: string | null;
}

export const DAY_OPTIONS = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
] as const;
