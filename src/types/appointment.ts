import { IDoctor } from "./doctor";

export interface IAppointment {
  _id: string;
  clinicId: string;
  branchId: string;
  doctorId: IDoctor;
  patientId?: string;
  date: Date;
  time: string;
  fullName: string;
  phone: string;
  city?: string;
  reason: string;
  mode: string;
  source: string;
  notes: string;
  reportedTime?: Date;
  status: string;
}
