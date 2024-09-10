import { IDoctor } from "../doctor";
import {
  ETreatmentCycleCategoryKey,
  ETreatmentCycleMetric,
  ETreatmentCycleReport,
  ETreatmentCycleType,
  IMasterTreatmentCycle,
} from "../master";
import { IPatient } from "../patient";

export interface IEditTreatmentCycleForm<T> {
  result: T;
  status: string;
  notes?: string;
  files?: string[];
}

export interface IEditTreatmentCyclePayload {
  result?: {
    TreatmentCycleName: string;
    details: any;
    files?: string[];
    notes?: string;
  };
  status: string;
  testType: ETreatmentCycleType;
}

export interface IPatientTreatmentCycleProtocol {
  _id: string;
  name: string;
  category: ETreatmentCycleCategoryKey;
  status: string;
  details: any;
}

export interface IPatientTreatmentCycleChecklist {
  _id: string;
  name: string;
  category: ETreatmentCycleCategoryKey;
  status: string;
  details: any;
}

export interface IPatientTreatmentCycleReport {
  _id: string;
  name: string;
  reportType: ETreatmentCycleReport;
  category: ETreatmentCycleCategoryKey;
  status: string;
  details: any;
}

export interface IPatientTreatmentCycleMetric {
  _id: string;
  name: string;
  metricType: ETreatmentCycleMetric;
  category: ETreatmentCycleCategoryKey;
  status: string;
  details: any;
}

export interface IPatientTreatmentCycle {
  _id: string;
  clinicId: string;
  cycleNo: number;
  branchId?: string;
  caseId: string;
  patient: IPatient;
  patientCode: string;
  doctor: IDoctor;
  cycle: IMasterTreatmentCycle;
  protocols: IPatientTreatmentCycleProtocol[];
  checklists: IPatientTreatmentCycleChecklist[];
  reports: IPatientTreatmentCycleReport[];
  metrics: IPatientTreatmentCycleMetric[];
  files: [string];
  date: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

// Treatment Cycle List
// Define individual interfaces for each content type with treatmentCycleId as mandatory
interface WithTreatmentCycleId {
  treatmentCycleId: string;
}

interface ContentPropsProtocol extends WithTreatmentCycleId {
  protocol: IPatientTreatmentCycleProtocol;
  checklist?: never;
  report?: never;
  metric?: never;
}

interface ContentPropsChecklist extends WithTreatmentCycleId {
  protocol?: never;
  checklist: IPatientTreatmentCycleChecklist;
  report?: never;
  metric?: never;
}

interface ContentPropsReport extends WithTreatmentCycleId {
  protocol?: never;
  checklist?: never;
  report: IPatientTreatmentCycleReport;
  metric?: never;
}

interface ContentPropsMetric extends WithTreatmentCycleId {
  protocol?: never;
  checklist?: never;
  report?: never;
  metric: IPatientTreatmentCycleMetric;
}

// Combine the interfaces to enforce that at least one of the four properties must be provided
export type ContentProps =
  | ContentPropsProtocol
  | ContentPropsChecklist
  | ContentPropsReport
  | ContentPropsMetric;
