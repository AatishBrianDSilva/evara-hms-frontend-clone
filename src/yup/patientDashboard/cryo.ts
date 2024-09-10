import * as Yup from "yup";

const cryoPreservationFieldSchema = Yup.object({
  cryoPreservation: Yup.object()
    .nullable()
    .required("CryoPreservation is required"), // Assuming procedure is an object and is required
  doctor: Yup.object().nullable().required("Doctor is required"), // Assuming doctor is an object and is required
  date: Yup.date().required("Date is required"), // Validating date
});
export const AddCryoPreservationValidationSchema = Yup.object({
  fields: Yup.array()
    .of(cryoPreservationFieldSchema)
    .required("At least one field is required"),
});

export const EmbryovalidationSchema = Yup.object().shape({
  details: Yup.object().shape({
    doctor: Yup.string().required("Doctor is required"),
    date: Yup.date().required("Date is required"),
    time: Yup.string().required("Time is required"),
    ivf: Yup.string().required("IVF is required"),
    embryologista: Yup.string().required("Embryologist 1 is required"),
    embryologistb: Yup.string().required("Embryologist 2 is required"),
    numberofoocytes: Yup.number()
      .required("Number of oocytes is required")
      .positive("Number of oocytes must be a positive number"),
    spermparameters: Yup.string().required("Sperm parameters is required"),
    methodofart: Yup.string().required("Method of ART is required"),
    numberofoocytefertilized: Yup.number()
      .required("Number of oocytes fertilized is required")
      .positive("Number of oocytes fertilized must be a positive number"),
    embryotransferdetails: Yup.string().required(
      "Embryo transfer details is required"
    ),
    totalnumberofembryofrozen: Yup.number()
      .required("Total number of embryos frozen is required")
      .positive("Total number of embryos frozen must be a positive number"),
    developmentStage: Yup.string().required("Development stage is required"),
    fragmentation: Yup.string().required("Fragmentation is required"),
    vitrificationmedia: Yup.string().required(
      "Vitrification media is required"
    ),
    embrayograde: Yup.string().required("Embryo grade is required"),
    embryoquality: Yup.string().required("Embryo quality is required"),
    hivhbag: Yup.string().required("HIV/HbAg/HCV/VDRL is required"),
    bloodgroupofwife: Yup.string().required("Blood group of wife is required"),
    bloodgroupofhusband: Yup.string().required(
      "Blood group of husband is required"
    ),
    expiryofmonths: Yup.string().required("Expiry of months is required"),
    dateofexpiry: Yup.date().required("Date of expiry is required"),
    cryoCANNumber: Yup.string().required("Cryo CAN number is required"),
    canisternumber: Yup.string().required("Canister number is required"),
    gobletcolours: Yup.string().required("Goblet colours is required"),
    overAllDefects: Yup.string().required("Overall defects is required"),
    tanknumber: Yup.string().required("Tank number is required"),
    container: Yup.string().required("Container is required"),
    note: Yup.string().required("Note is required"),
    description: Yup.string().required("Description is required"),
    disclaimer: Yup.string().required("Disclaimer is required"),
  }),
});

export const SpermValidationSchema = Yup.object().shape({
  details: Yup.object().shape({
    doctor: Yup.string().required("Doctor is required"),
    date: Yup.date().required("Date is required"),
    spermProductionDate: Yup.string(),
    spermFreezingType: Yup.string(),
    spermFreezingId: Yup.string(),
    periodOfAbstinence: Yup.string(),
    sampleCollectionLocation: Yup.string(),
    freezingDate: Yup.string(),
    morphology: Yup.string(),
    durationOfFreezing: Yup.string(),
    daysOfFreezing: Yup.string(),
    embryologist: Yup.string(),
    noOfVials: Yup.string(),
    cryoVialNo: Yup.string(),
    cannisterNo: Yup.string(),
    tankNo: Yup.string(),
    comments: Yup.string(),
    freezingMedia: Yup.string(),
    mediaBatchNo: Yup.string(),
    mediaExpiryDate: Yup.string(),
    mediaRemarks: Yup.string(),
    semenPreparation: Yup.string(),
    spermVol: Yup.string(),
    spermConc: Yup.string(),
    motility: Yup.string(),
    progressiveMotility: Yup.string(),
    nonProgressiveMotility: Yup.string(),
    immotile: Yup.string(),
    washType: Yup.string(),
  }),
});
