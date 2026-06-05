/** Patient record shape returned by `GET /api/patients` (NestJS). */
export interface ApiPatient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  assignedDoctorId?: string;
  createdAt: string;
  updatedAt: string;
}
