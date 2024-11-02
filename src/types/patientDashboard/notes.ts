import { IDoctor } from '../doctor';
import { IPatient } from '../patient';

export interface IPatientNotes {
  _id: string;
  observations: string[];
  observationNotes: string;
  medications: string[];
  medicationsNotes: string;
  scans: string[];
  scansNotes: string;
  treatmentAdvices: string[];
  treatmentAdvicesNotes: string;
  notes: string;
  doctor: IDoctor;
  patient: IPatient;
}
