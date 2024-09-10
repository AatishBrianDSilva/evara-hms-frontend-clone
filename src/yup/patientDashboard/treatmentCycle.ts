import * as Yup from "yup";

export const IUIProtocolValidationSchema = Yup.object({
  lmpDate: Yup.date().required("LMP Date is required"),
  cycleNumber: Yup.string().required("Cycle Number is required"),
});

export const IUIChecklistValidationSchema = Yup.object({
  femaleHistorySheetComplete: Yup.boolean().required(
    "Female History Sheet is required"
  ),
  maleHistorySheetComplete: Yup.boolean().required(
    "Male History Sheet is required"
  ),
  uterus: Yup.string().required("Uterus is required"),
  hysteroScopyFindings: Yup.boolean().required(
    "HysteroScopy Findings is required"
  ),
  totalPatencyStatus: Yup.string().required("Total Patency Status is required"),
  consentForm: Yup.boolean().required("Consent Form is required"),
  otherInformation: Yup.string(),
});

export const IUIHReportValidationSchema = Yup.object({
  volume: Yup.string().required("Volume is required"),
  abstinence: Yup.string().required("Abstinence is required"),
  timeOfCollection: Yup.date().required("Time of Collection is required"),
  liquefaction: Yup.string().required("Liquefaction is required"),
  spermConcentration: Yup.string().required("Sperm Concentration is required"),
  totalEjaculate: Yup.string().required("Total Ejaculate is required"),
  timeOfDispatch: Yup.date().required("Time of Dispatch is required"),
  ph: Yup.string().required("PH is required"),
  rbc: Yup.string().required("RBC is required"),
  color: Yup.string().required("Color is required"),
  viscosity: Yup.string().required("Viscosity is required"),
  pusCells: Yup.string().required("Pus Cells is required"),
  totalMotiliy: Yup.string().required("Total Motility is required"),
  progression: Yup.string().required("Progression is required"),
  nonProgression: Yup.string().required("Non Progression is required"),
  immotile: Yup.string().required("Immotile is required"),
  morphology: Yup.string().required("Morphology is required"),
  normalForms: Yup.string().required("Normal Forms is required"),
  epithilialCells: Yup.string().required("Epithilial Cells is required"),
  spermPreparationMethod: Yup.string().required(
    "Sperm Preparation Method is required"
  ),
  volumePrepared: Yup.string().required("Volume Prepared is required"),
  spermRecovery: Yup.string().required("Sperm Recovery is required"),
  expiryDate: Yup.date().required("Expiry Date is required"),
  totalMotileSperm: Yup.string().required("Total Motile Sperm is required"),
  nonProgressivePostWash: Yup.string().required(
    "Non Progressive Post Wash is required"
  ),
  immotilePostWash: Yup.string().required("Immotile Post Wash is required"),
  totalMotilePostWash: Yup.string().required(
    "Total Motile Post Wash is required"
  ),
  normalFormsPostWash: Yup.string().required(
    "Normal Forms Post Wash is required"
  ),
  date: Yup.date().required("Date is required"),
  impression: Yup.string().required("Impression is required"),
  embryologist1: Yup.string().required("Embryologist-1 is required"),
  embryologist2: Yup.string(),
  gyneacologist1: Yup.string().required("Gyneacologist-1 is required"),
  gyneacologist2: Yup.string(),
  processingMethod: Yup.string().required("Processing Method is required"),
  comments: Yup.string(),
  description: Yup.string(),
});

export const IUIDReportValidationSchema = Yup.object({
  date: Yup.date().required("Date is required"),
  timeOfThawing: Yup.date().required("Time of Thawing is required"),
  donorNo: Yup.string().required("Donor No is required"),
  donorBloodGroup: Yup.string().required("Donor Blood Group is required"),
  semenBankDetails: Yup.string().required("Semen Bank Details is required"),
  volume: Yup.string().required("Volume is required"),
  pusCells: Yup.string().required("Pus Cells is required"),
  epithilialCells: Yup.string().required("Epithilial Cells is required"),
  appearance: Yup.string().required("Appearance is required"),
  agglutination: Yup.string().required("Agglutination is required"),
  consultant: Yup.string().required("Consultant is required"),
  count: Yup.string().required("Count is required"),
  rapidLinearProgression: Yup.string().required(
    "Rapid Linear Progression is required"
  ),
  nonProgressive: Yup.string().required("Non Progressive is required"),
  immotile: Yup.string().required("Immotile is required"),
  totalMotility: Yup.string().required("Total Motility is required"),
  totalSpermCount: Yup.string().required("Total Sperm Count is required"),
  countPostWash: Yup.string().required("Count Post Wash is required"),
  rapidLinearProgressionPostWash: Yup.string().required(
    "Rapid Linear Progression Post Wash is required"
  ),
  nonProgressivePostWash: Yup.string().required(
    "Non Progressive Post Wash is required"
  ),
  immotilePostWash: Yup.string().required("Immotile Post Wash is required"),
  totalMotilityPostWash: Yup.string().required(
    "Total Motility Post Wash is required"
  ),
  inseminatedVolume: Yup.string().required("Iseminated Volume is required"),
  impression: Yup.string().required("Impression is required"),
  remarks: Yup.string(),
  description: Yup.string(),
});

export const PregnancyOutcomeBetaHCGValidationSchema = Yup.object({
  hcg: Yup.string().required("HCG Value is required"),
  outcome: Yup.string().required("Outcome is required"),
});

export const IVFReportValidationSchema = Yup.object({
  embryologista: Yup.string().required("Embryologist 1 is required"),
  embryologistb: Yup.string().required("Embryologist 2 is required"),
  gynecologist1: Yup.string().required("Gynecologist 1 is required"),
  dateofthawing: Yup.string().required("Date Of Thawing is required"),

  gynecologist2: Yup.string().required("Gynecologist 2 is required"),

  NoOfEmbryosThawed: Yup.string().required("No Of Embryos Thawed is required"),
  PostThawingSurvival: Yup.string().required("Post Thaw Survival is required"),
  NumberofEmbryosTransferred: Yup.string().required(
    "Number of Embryos Transferred is required"
  ),
  StatusOfTRemainigEmbryos: Yup.string().required(
    "Status of Remaining Embryos is required"
  ),

  StagesOfEmbryoonicDevelopment: Yup.string().required(
    "Stages Of Embryoonic Development is required"
  ),
  TransferComments: Yup.string().required("Transfer Comments is required"),
  endometrialThicknessOnDayOfTransfer: Yup.string().required(
    "Endometrial Thickness on Day of Transfer is required"
  ),
  DescriptionOfEmbryoTransfer: Yup.string().required(
    "Description Of Embryo Transfer is required"
  ),
  EmbryoDiscarded: Yup.string().required("Embryo Discarded is required"),
  EmbryoExpiryDate: Yup.string().required("Embryo Expiry Date is required"),
  serumBetaHCGDate: Yup.string().required("Serum is required"),
  ReferenceDoctor: Yup.string().required("Reference Doctor is required"),
  AssistedHatching: Yup.string().required("Assisted Hatching is required"),
  doctorRemarks: Yup.string().required("Doctor Remarks is required"),
  Advise: Yup.string().required("Advise is required"),
  timeOfThawing: Yup.string().required("Time of thawing is required"),
  timeOfEmbryoTransfer: Yup.string().required(
    "Time of Embryo Transfer is required"
  ),
  MedicationAsPerDoctorPrescription: Yup.string().required(
    "Medication as per doctor prescription is required"
  ),
});

export const IVFProtocolValidationSchema = Yup.object({
  lmpDate: Yup.date().required("LMP Date is required"),
  dawnRegistrationDate: Yup.date().required(
    "Dawn Registration Date is required"
  ),
  stimulationDate: Yup.date().required("Stimulation Date is required"),
  expectedEggPickUpDate: Yup.date().required(
    "Expected Egg Pick Up Date is required"
  ),
  eggPickUpDate: Yup.date().required("Egg Pickup Date is required"),
});

export const IVFChecklistValidationSchema = Yup.object({
  PatientName: Yup.string().required("Patient Name is required"),
  maleHistorySheetComplete: Yup.string().required(
    "Male History Sheet Complete is required"
  ),
  FemaleHistorySheetComplete: Yup.string().required(
    "Female History Sheet Complete is required"
  ),
  MaleHistorySheetComplete1: Yup.string().required(
    "Is Male History Sheet Complete 1 is required"
  ),
  MaleHistorySheetComplete2: Yup.string().required(
    "Is Male History Sheet Complete 2 is required"
  ),
  Ivficsi: Yup.string().required("IVF/ICSI is required"),
  embryoFreeze: Yup.string().required("Embryo Freezing is required"),
  EmbryologyTimingOfHcg: Yup.string().required(
    "Embryology Timing Of Hcg is required"
  ),
  AnaesthistToBeInformedForAnesthesia: Yup.string().required(
    "Anaesthist To Be Informed For Anesthesia is required"
  ),
  BloodReport: Yup.string().required("Blood Report is required"),
});

// Treatment Cycles
const treatmentCycleFieldSchema = Yup.object({
  treatmentCycle: Yup.object()
    .nullable()
    .required("Treatment Cycle is required"), // Assuming procedure is an object and is required
  doctor: Yup.object().nullable().required("Doctor is required"), // Assuming doctor is an object and is required
  date: Yup.date().required("Date is required"), // Validating date
});
export const AddTreatmentCycleValidationSchema = Yup.object({
  fields: Yup.array()
    .of(treatmentCycleFieldSchema)
    .required("At least one field is required"),
});
