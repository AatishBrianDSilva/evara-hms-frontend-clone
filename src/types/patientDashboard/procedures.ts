import { IDoctor } from "../doctor";
import { EProcedureType, IMasterProcedures } from "../master";
import { IPatient } from "../patient";

export interface IEditProcedureForm<T> {
  result: T;
  status: string;
  notes?: string;
  files?: string[];
}

export interface IEditProcedurePayload {
  result?: {
    procedureName: string;
    details: any;
    files?: string[];
    notes?: string;
  };
  status: string;
  testType: EProcedureType;
}

export interface IPatientProcedure {
  _id: string;
  clinicId: string;
  branchId?: string;
  caseId: string;
  patient: IPatient;
  patientCode: string;
  doctor: IDoctor;
  procedure: IMasterProcedures;
  result?: IProcedureResult;
  date: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

interface IProcedureResult {
  _id: string;
  procedureName: string;
  details: any;
  files?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmbryoBiopsyDetails {
  id: string;
  pcr_tube_id: string;
  embryo_id: string;
  no_of_cells: number;
  cell_stage: number;
  embryo_grade: "Low" | "High";
  nucleus_seen: "Yes" | "No";
  cell_integrity: "Intact" | "Lysed";
  remarks: string;
  isNew?: boolean;
}

export interface IPGTDetailsForm {
  karyotype: string;
  clinicalReasons: string[];
  otherReason: string;
  noOfBiopsies: string;
  biopsyMethod: string;
  biopsyPerformedBy: string;
  biopsyDate: Date | null;
  plannedDate: Date | null;
  embryosCryopreserved: string;
  resultsForTransfer: string;
  results: string;
  embryoBiopsyDetails: IEmbryoBiopsyDetails[];
  description: string;
  day3Blastomere: boolean;
  day5Trophectoderm: boolean;
}

export interface ITesaForm {
  // lmpDate: Date | null;
  // requestedDate: Date | null;
  // dateOfScan: Date | null;
  // dayOfCycle: string;
  // utreusAppearedDesc: string;
  // doctor: IDoctor | null;
  // uterusMeasurement: string;
  // anteriorWall: string;
  // posteriorWall: string;
  // uterusVolume: string;
  // endometrialThickness: string;
  // anyOtherPathology: string;
  // doctorRemarks: string;
  // description: string;
  // investigationsSent: string;
  // postOperativeInstructions: string;
  // operationDetails: string;
  // typeOfAnaesthesia: string;
  // procedureDetails: string;
  // findings: string;
  // summary: string;
  // anaesthetist: string;
  // complaintHistory: string;

  dateOfAdmission: Date | null;
  dateOfOperation: Date | null;
  dateOfDischarge: Date | null;
  indication: string;
  operationDetails: string;
  complaintHistory: string;
  surgeon: string;
  anaesthetist: string;
  typeOfAnaesthesia: string;
  procedureDetails: string;
  findings: string;
  summary: string;
  investigationsSent: string;
  postOperativeInstructions: string;
  embryologist: string;
  remarks: string;
  description: string;
}
