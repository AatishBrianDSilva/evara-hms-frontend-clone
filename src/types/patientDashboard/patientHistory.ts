export interface IPatientHistory {
  _id: string;
  patientId: string;
  patientCode: string;
  clinicId: string;
  branchId: string;
  medicalHistory: IMedicalHistory;
  menstrualAndOvulationHistory: IMenstrualAndOvulationHistory;
  coitalHistory: ICoitalHistory;
  diseaseAdverseEffect: IDiseaseAdverseEffect;
  otherFactorsAdverseEffect: IOtherFactorsAdverseEffect;
  generalPhysicalExamination: IGeneralPhysicalExamination;
  investigations: IInvestigations;
  summary: ISummary;
  files?: string[];
}

export interface IMedicalHistory {
  _id: string;
  marriedLife: string;
  infertility: string;
  infertilityDuration: string;
  consanguineousMarriage: string;
  contraception: string;
  noOfPregnencies: string;
  previousInfertilityTreatments: string;
  medicalHostoryNotes: string;
}

export interface IMenstrualAndOvulationHistory {
  _id: string;
  lmpDate: Date;
  ageAtMenarche: string;
  mensturalRegularity: string;
  mensturalBleeding: string;
  longestCycleDuration: string;
  shortestCycleDuration: string;
  periodDuration: string;
  imb: string;
  pcb: string;
  dyspareunia: string;
  dischargePV: string;
  passageOfClots: string;
  galactorrhoeaHistory: string;
  hirsutisnm: string;
  visualDisturbances: string;
  dysmenorrhoea: string;
  weightGainLoss: string;
  urinaryBowelProblems: string;
  mesturalNotes: string;
}

export interface ICoitalHistory {
  _id: string;
  frequencyCoitus: string;
  fertilityPeriodKnowledge: string;
  coitalHistoryNotes: string;
}

export interface IDiseaseAdverseEffect {
  _id: string;
  diabetes: string;
  thyroid: string;
  tuberculosis: string;
  otherDisease: string;
  diseaseNotes: string;
}

export interface IOtherFactorsAdverseEffect {
  _id: string;
  environmentalEffects: string;
  smoking: string;
  alcohol: string;
  hivRisk: string;
  previousTreaments: string;
  allergies: string;
  surgicalHistory: string;
  familyHistory: string;
  otherFactorNotes: string;
}

export interface IGeneralPhysicalExamination {
  _id: string;
  height: string;
  weight: string;
  bmi: string;
  bp: string;
  chest: string;
  cvs: string;
  ipe: string;
  ipe2: string;
  hairDistributionScore: string;
  generalExamination: string;
  breastDevelopment: string;
  galactorrhoea: string;
  breastLumps: string;
  lymphNodes: string;
  pelvicExamination: string;
  genralExaminationNotes: string;
}

export interface IInvestigations {
  _id: string;
  cbpDate: Date;
  cbpResult: string;
  e2Date: Date;
  e2Result: string;
  hepCDate: Date;
  hepCResult: string;
  hivDate: Date;
  hivResult: string;
  cmiaDate: Date;
  cmiaResult: string;
  rbsDate: Date;
  rbsResult: string;
  tshDate: Date;
  tshResult: string;
  vdrlDate: Date;
  vdrlResult: string;
  prolactinDate: Date;
  prolactinResult: string;
  spermAssessmentDate: Date;
  spermAssessmentResult: string;
  bloodGroupDate: Date;
  bloodGroupResult: string;
  esrDate: Date;
  esrResult: string;
  rubellaDate: Date;
  rubellaResult: string;
  fshDate: Date;
  fshResult: string;
  lhDate: Date;
  lhResult: string;
  papDate: Date;
  papResult: string;
  progesteroneDate: Date;
  progesteroneResult: string;
  amhDate: Date;
  amhResult: string;
  kcacDate: Date;
  kcacResult: string;
  ca125Date: Date;
  ca125Result: string;
  vitaminDDate: Date;
  vitaminDResult: string;
  histopathologyDate: Date;
  histopathologyResult: string;
  tbpcrDate: Date;
  tbpcrResult: string;
  bacterialViginosisDate: Date;
  bacterialViginosisResult: string;
  lhIvfDate: Date;
  lhIvfResult: string;
}

export interface ISummary {
  _id: string;
  impression: string;
  treatmentPlan: string;
  summarySummary: string;
}
