import { IDoctor } from "../doctor";
import { ETestType, IMasterInvestigation, IMasterPackage } from "../master";
import { IPatient } from "../patient";

export interface IEditInvestigationForm<T> {
  result: T;
  status: string;
  notes?: string;
  files?: string[];
}

export interface IEditInvestigationpayload {
  result?: {
    testName?: string;
    details?: any;
    files?: string[];
    notes?: string;
  };
  status: string;
  testType: ETestType;
  actualName?: string;
}

export interface IPatientInvestigation {
  _id: string;
  clinicId: string;
  branchId?: string;
  caseId: string;
  patient: IPatient;
  patientCode: string;
  doctor: IDoctor;
  investigation: IMasterInvestigation;
  result?: ITestResult;
  date: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

interface ITestResult {
  _id: string;
  testName: string;
  details:
    | IBoodTestForm[]
    | IUltraSoundScanForm
    | IHysteroscopyForm
    | IEarlyPregnancyForm
    | IEndometrialAssessmentForm
    | ISemenAnalysisForm
    | ISpermDFIForm;
  files?: string[]; // An array of file URLs related to the test result as a whole
  notes?: string; // Optional notes for the overall test result
  createdAt: Date;
  updatedAt: Date;
}

export interface IBoodTestForm {
  id: string;
  component: string;
  value: string;
  unit?: string;
  referenceRange?: string;
}

export interface IUltraSoundScanForm {
  scanType: string;
  lmpDate: Date | null;
  requestedDate: Date | null;
  dateOfScan: Date | null;
  dayOfCycle: number | string;
  transAbdominal: boolean;
  transVaginalSonography: boolean;
  utreusAppeared: string;
  utreusAppearedDesc?: string;
  uterusMeasurement: number | string;
  anteriorWall: string;
  posteriorWall: string;
  uterusVolume: number | string;
  uterocervicalLength: number | string;
  uterineLength: number | string;
  cervicalLength: number | string;
  myometrium: string;
  cavityEchoAppeared: string;
  endometrialThickness: number | string;
  anyOtherPathology?: string;
  rightOvary?: {
    notVisualzed: boolean;
    volume?: number | string;
    ovaryMeasurement?: number | string;
    smallFollicles?: number | string;
    ovaryAFC?: number | string;
    dominantFollicleOrCyst?: string;
    accessibility?: string;
    adnexa?: string;
  };
  leftOvary?: {
    notVisualzed?: boolean;
    volume?: number | string;
    ovaryMeasurement?: number | string;
    smallFollicles?: number | string;
    ovaryAFC?: number | string;
    dominantFollicleOrCyst?: string;
    accessibility?: string;
    adnexa?: string;
  };
  impression: string;
  doctor: IDoctor | null;
  doctorRemarks: string;
  description: string;
}

export interface IHysteroscopyForm {
  clinicalDiagnosis: string;
  lmp: Date | null;
  dayOfCycle: number;
  dateOfAdmission: Date | null;
  dateOfProcedure: Date | null;
  dateOfDischarge: Date | null;
  operation: string;
  finalDiagnosisAfterOperation: string;
  hospital: string;
  gynaecologist: string;
  assistant: string;
  typeOfAnesthesia: string;
  anaesthetist: string;
  description: string;

  spouseName: string;
  complaintHistory: string;
  indication: string;
  surgeon: string;
  procedureDone: string;
  findings: string;
  impressionSummary: string;
  postOP: string;
  investigationsSent: string;
  reviewDate: Date | null;
}

export interface ILaparoscopyForm {
  dateOfAdmission: Date | null;
  dateOfOperation: Date | null;
  dateOfDischarge: Date | null;
  complaintHistory: string;
  indication: string;
  operationDetails: string;
  findings: string;
  impressionSummary: string;
  postOP: string;
  investigationsSent: string;
  reviewDate: Date | null;
  description: string;
}

interface IOvary {
  notVisualized?: boolean;
  volume?: number | string;
  ovaryMeasurement?: number | string;
  smallFollicles?: number | string;
  ovaryAFC?: number | string;
  dominantFollicleOrCyst?: string;
  accessibility?: string;
  adnexa?: string;
}

export interface IEarlyPregnancyForm {
  scanType: string;
  lmpDate: Date | null;
  embryoTransferDate: Date | null;
  requestedDate: Date | null;
  dateOfScan: Date | null;
  lmpGA: string;
  EDDbyDoc: string;
  EDDbyLmp: string;
  dateOfConception: Date | null;
  modeOfConception: string;
  menstrualCycle: string;
  bloodGroup: string;
  bmi: string;
  obstetricHistory: string;
  routeOfScan: string;
  machineModel: string;
  view: string;
  pregnancySite: string;
  gestationalSAC: string;
  yolkSAC: string;
  fetalPole: string;
  cardiacActivity: string;
  cervicalLength: string;
  rightOvary?: IOvary;
  leftOvary?: IOvary;
  earlyOutcome: string;
  impression: string;
  disclaimer: string;
  doctor: string;
  crl: string;
  description: string;
}

export interface IEndometrialAssessmentForm {
  indication: string;
  lmpDate: Date | null;
  endometrialAssessments: {
    date: Date | null;
    day: number | string;
    endometrialThickness: number | string;
    medication: string[];
    remarks: string;
  }[];
  impression: string;
  doctor: IDoctor | null;
  doctorRemarks: string;
}

export interface ISemenAnalysisForm {
  date: Date | null;
  spermDfi: string;
  timeOfSampleReceivedAtHospital: Date | null;
  placeOfCollection: string;
  timeOfCollection: Date | null;
  timeOfEvaluation: Date | null;
  daysOfAbstinence: string;
  volume: string;
  spillage: string;
  appearance: string;
  liquefaction: string;
  viscosity: string;
  ph: string;
  color: string;
  spermConcMillionsPerMl: string;
  pusCells: string;
  rbc: string;
  agglutination: string;
  totalEjaculateMillions: string;
  fructose: string;
  epithelialCells: string;
  live: string;
  dead: string;
  impressionPhysicalAssessment: string;
  rapidProgressiveGradeA: string;
  slowProgressiveGradeB: string;
  nonProgressiveGradeC: string;
  immotileGradeD: string;
  impressionSpermMotility: string;
  normalForms: string;
  headDefects: string;
  overAllDefects: string;
  midPieceAndNeckDefects: string;
  cytoplasmicDroplets: string;
  tailDefects: string;
  defectsInHeadMidPieceNeckAndTail: string;
  impressionMorphologyAssessment: string;
  hos: string;
  acrosomeIntactnessAI: string;
  zonaBindingPotentialOfSpermAsPerAITesting: string;
  analysis: string;
  description: string;
  disclaimer: string;
}

export interface ISpermDFIForm {
  collectionDate: Date | null;
  timeOfCollection: Date | null;
  timeOfEvaluation: Date | null;
  sampleCollectedAt: string;
  abstinence: string;
  color: string;
  volume: string;
  liquefaction: string;
  viscosity: string;
  count: string;
  motility: string;
  rapidProgressive: string;
  slowProgressive: string;
  nonProgressive: string;
  immobile: string;
  normalForms: string;
  spillage: string;
  agglutination: string;
  dfi: string;
  embryologist: string;
  referredBy: string;
  impressions: string;
  description: string;
}

export interface ICryoPreservationEmbryoForm {
  doctor: string | null;
  date: Date | null;
  timeOfFreezing: Date | null;
  ivf: string;
  embryologistA: string;
  embryologistB: string;
  numberOfOocytes: string;
  spermParameters: string;
  methodOfArt: string;
  numberOfOocyteFertilized: string;
  embryoTransferDetails: string;
  totalNumberOfEmbryoFrozen: string;
  developmentStage: string;
  fragmentation: string;
  vitrificationMedia: string;
  embryoGrade: string;
  embryoQuality: string;
  hivHbag: string;
  bloodGroupOfWife: string;
  bloodGroupOfHusband: string;
  expiryOfMonths: string;
  dateOfExpiry: Date | null;
  cryoCanNumber: string;
  canisterNumber: string;
  files: [];
  gobletColours: string;
  overallDefects: string;
  tankNumber: string;
  container: string;
  note: string;
  description: string;
  disclaimer: string;
}

export interface ICryoPreservationSpermForm {
  // doctor: string;
  // date: Date | null;
  // time: Date | null;
  spermProductionDate: Date | null;
  spermFreezingType: string;
  spermFreezingId: string;
  periodOfAbstinence: string;
  sampleCollectionLocation: string;
  freezingDate: Date | null;
  morphology: string;
  // semenPreparation: string;
  // spermVol: string;
  // spermConc: string;
  // motility: string;
  // progressiveMotility: string;
  // nonProgressiveMotility: string;
  // immotile: string;
  // washType: string;
  durationOfFreezing: string;

  embryologist: string;
  noOfVials: string;
  cryoVialNo: string;
  cannisterNo: string;
  tankNo: string;
  comments: string;
  freezingMedia: string;
  mediaBatchNo: string;
  mediaExpiryDate: Date | null;
  mediaRemarks: string;
  discard: boolean;
  description: string;
  sperm_wash_items: [
    {
      semenPreparation: string;
      spermVol: string;
      spermConc: string;
      motility: string;
      progressiveMotility: string;
      nonProgressiveMotility: string;
      immotile: string;
      washType: string;
    }
  ];
}

export interface ITimelineItem {
  date: string;
  items: Array<{
    type: string;
    name: string;
    status: string;
    id: string;
  }>;
}

export interface IPatientPackage {
  _id: string;
  clinicId: string;
  branchId?: string;
  caseId: string;
  patient: IPatient;
  patientCode: string;
  doctor?: IDoctor;
  package: IMasterPackage;
  date: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IPatientTimelineResponse {
  date: string;
  items: ITimelineItem[];
}
