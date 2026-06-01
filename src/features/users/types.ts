export type StaffStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";

export interface StaffUser {
  id: string;
  fullName: string;
  employeeId: string;
  email: string;
  role: string;
  department: string;
  status: StaffStatus;
}
