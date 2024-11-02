import { IDoctor } from '../doctor';
import { IMasterService } from '../master';
import { IPatient } from '../patient';

export interface IPatientService {
  _id: string;
  clinicId: string;
  branchId?: string;
  caseId: string;
  patient: IPatient;
  patientCode: string;
  doctor: IDoctor;
  service: IMasterService;
  date: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
