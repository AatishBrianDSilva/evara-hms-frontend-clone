import { IDoctor } from './doctor';
import { IPatient } from './patient';

export enum EGender {
  Male = 'male',
  Female = 'female',
  Both = 'both',
}

// Services
export enum EServiceTypes {
  Appointment = 'Appointment',
  FirstConsultation = 'First Consultation',
  FollowUp = 'Follow Up',
  DoctorsReview = "Doctor's Review",
}

export interface IDefaultService {
  _id: string;
  serviceId: string;
  name: string;
  serviceType: EServiceTypes;
  description: string;
}

export interface IMasterService {
  _id: string;
  serviceType: EServiceTypes;
  service: IDefaultService;
  name: string;
  description?: string;
  cost: number;
  validTill: string;
  active: boolean;
}

export interface IPatientService {
  _id: string;
  clinicId: string;
  branchId?: string;
  patient: IPatient;
  doctor?: IDoctor;
  patientCode: string;
  service: IMasterService;
  dateAssigned: Date;
  caseId?: string;
}

export interface IMasterPackages {
  _id: string;
  name: string;
  gender: string;
  price: number;
  validTill: Date;
  active: boolean;
  clinicId: string;
  procedures: IMasterProcedures[];
  investigations: IMasterInvestigation[];
  services: IMasterService[];
  cryoPreservations: IMasterCryoPreservations[];
  treatmentCycles: IMasterTreatmentCycle[];
}

// Investigations

export enum ETestType {
  BloodTest = 'BloodTest',
  UltrasoundScan = 'UltrasoundScan',
  BaseLineFollicularMonitoring = 'BaseLineFollicularMonitoring',
  EndometrialAssessment = 'EndometrialAssessment',
  EarlyPregnancyScan = 'EarlyPregnancyScan',
  SemenAnalysis = 'SemenAnalysis',
  SpermDFI = 'SpermDFI',
}

export interface IMasterInvestigation {
  _id: string;
  test: IMedicalTest;
  testType: ETestType;
  name: string;
  description?: string;
  cost: number;
  tax: number;
  total: number;
  validTill: string;
  active: boolean;
}

export interface IPatientInvestigation {
  _id: string;
  clinicId: string;
  branchId?: string;
  patient: IPatient;
  doctor?: IDoctor;
  patientCode: string;
  investigation: IMasterInvestigation;
  dateAssigned: Date;
  caseId?: string;
}

export interface IMasterDashboardInvestigaton {
  _id: string;
  testType: string;
  test: IMasterInvestigation;
  name: string;
  gender: string;
  description: string;
  cost: number;
  active: boolean;
  __v: number;
  tax: number;
  total: number;
}

interface IMedicalTest {
  _id: string;
  testId: string;
  testName: string;
  testType: ETestType;
  description: string;
  gender: EGender;
  components?: IBloodTestComponent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IBloodTestComponent {
  _id?: string;
  componentName: string;
  componentType: IBloodTestComponentType;
  options?: string[];
  unit?: string;
  value?: string;
  referenceRange?: string;
}

export enum IBloodTestComponentType {
  Text = 'text',
  Select = 'select',
}

export interface IServiceInvestigation {
  _id: string;
  name: string;
  testName: string;
  testId: string;
  cost: number;
  tax: number;
  total: number;
  description: string;
  testType: string;
  validTill: string;
  isActive: boolean;
  gender: EGender;
  createdAt: Date;
  test: IMedicalTest[];
}

// Procedures

export enum EProcedureType {
  Hysteroscopy = 'Hysteroscopy',
  Laparoscopy = 'Laparoscopy',
  TESA = 'TESA',
  TESE = 'TESE',
  PGT = 'PGT',
  ERA = 'ERA',
  Embryo = 'Embryo',
}

export interface IMasterProcedures {
  _id: string;
  procedureType: EProcedureType;
  procedure: IMedicalProcedure;
  gender: EGender;
  name: string;
  description?: string;
  cost: number;
  active: boolean;
  validTill: string;
}

interface IMedicalProcedure {
  _id: string;
  procedureId: string;
  procedureName: string;
  procedureType: EProcedureType;
  description: string;
  gender: EGender;
}

export interface IServiceProcedure {
  _id: string;
  testName: string;
  testId: string;
  cost: number;
  tax: number;
  total: number;
  description: string;
  testType: string;
  createdAt: Date;
  procedure: IMedicalProcedure[];
}

// CryoPreservations
export enum ECryoPreservationType {
  Embryo = 'Embryo',
  Sperm = 'Sperm',
}

export interface ICryoPreservations {
  cryoPreservationId: string;
  cryoPreservationName: string;
  cryoPreservationType: ECryoPreservationType;
  description: string;
  gender: EGender;
}

export interface IMasterCryoPreservations {
  _id: string;
  cryoPreservationType: ECryoPreservationType;
  cryoPreservation: ICryoPreservations;
  gender: EGender;
  name: string;
  description?: string;
  cost: number;
  validTill: string;
  active: boolean;
}

// Treatment Cycles
export enum ETreatmentCycleType {
  IUI = 'IUI',
  OITI = 'OITI',
  IVFPlusFET = 'IVFPlusFET',
  IVFWithDonorEgg = 'IVFWithDonorEgg',
  ICSIWithDonorEgg = 'ICSIWithDonorEgg',
  IVFPlusFETNoGrowthHormone = 'IVFPlusFETNoGrowthHormone',
}

export enum ETreatmentCycleReport {
  IUIHReport = 'IUIHReport',
  IUIDReport = 'IUIDReport',
  OITIReport = 'OITIReport',
  OPUReport = 'OPUReport',
  EmbryoTransferReport = 'EmbryoTransferReport',
  IVFSummaryReport = 'IVFSummaryReport',
}

export enum ETreatmentCycleMetric {
  PregnancyOutcomeBetaHCGMetric = 'PregnancyOutcomeBetaHCGMetric',
  EmbryologyWorksheetMetric = 'EmbryologyWorksheetMetric',
}

export enum ETreatmentCycleCategoryKey {
  protocols = 'protocols',
  checklists = 'checklists',
  reports = 'reports',
  metrics = 'metrics',
}

export interface IMasterTreatmentCycle {
  _id: string;
  cycleType: ETreatmentCycleType;
  treatmentCycle: IDefaultTreatmentCycle;
  gender: EGender;
  name: string;
  description?: string;
  cost: number;
  validTill: string;
  active: boolean;
}

export interface IDefaultTreatmentCycle {
  _id: string;
  cycleId: string;
  cycleName: string;
  cycleType: ETreatmentCycleType;
  description: string;
  gender: EGender;
  protocols: [
    {
      name: string;
    },
  ];
  checklists: [
    {
      name: string;
    },
  ];
  reports: [
    {
      name: string;
      reportType: ETreatmentCycleReport;
    },
  ];
  metrics: [
    {
      name: string;
      metricType: ETreatmentCycleMetric;
    },
  ];
}

// Master Package
export interface IMasterPackage {
  _id: string;
  clinicId: string;
  name: string;
  price: number;
  validTill: string;
  active: boolean;
  items: IPackageItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPackageItem {
  _id: string;
  item:
    | IMasterProcedures
    | IMasterInvestigation
    | IMasterService
    | IMasterCryoPreservations
    | IMasterTreatmentCycle;
  name: string;
  validTill: Date;
  isPackageItem: boolean;
}
