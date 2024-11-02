import * as Yup from 'yup';

const investigationFieldSchema = Yup.object({
  investigation: Yup.object().nullable().required('Investigation is required'), // Assuming investigation is an object and is required
  doctor: Yup.object().nullable().required('Doctor is required'), // Assuming doctor is an object and is required
  date: Yup.date().required('Date is required'), // Validating date
});

export const AddInvestigationValidationSchema = Yup.object({
  fields: Yup.array()
    .of(investigationFieldSchema)
    .required('At least one field is required'),
});

export const getEditBloodTestReportValidationSchema = (addReport: boolean) => {
  const schema = {
    status: Yup.string().required('Status is required'),
  };

  if (addReport) {
    Object.assign(schema, {
      reportDetails: Yup.array().of(
        Yup.object({
          id: Yup.string().required('ID is required'),
          name: Yup.string().required('Name is required'),
          value: Yup.string().required('Value is required'),
          componentType: Yup.string().required('Component type is required'),
          unit: Yup.string(),
          referenceRange: Yup.string(), // Optional, so no 'required'
          group: Yup.string(), // Optional, so no 'required'
        }).required('Report detail is required'),
      ),
      notes: Yup.string(),
      files: Yup.array().of(Yup.string().required('File is required')),
    });
  }

  return Yup.object(schema);
};

export const semenvalidationSchema = Yup.object().shape({
  result: Yup.object().shape({
    date: Yup.string().required(''),
    spermDfi: Yup.string().required('Sperm DFI is required'),
    timeOfSampleReceivedAtHospital: Yup.date().required(
      'Time of Sample Received at Hospital is required',
    ),
    placeOfCollection: Yup.string().required('Place of Collection is required'),
    timeOfCollection: Yup.date().required('Time Of Collection is required'),
    timeOfEvaluation: Yup.date().required('Time Of Evaluation is required'),
    daysOfAbstinence: Yup.string().required('Days of Abstinence is required'),
    volume: Yup.string().required('Volume is required'),
    spillage: Yup.string().required('Spillage is required'),
    appearance: Yup.string().required('Appearance is required'),
    liquefaction: Yup.string().required('Liquefaction is required'),
    viscosity: Yup.string().required('Viscosity is required'),
    ph: Yup.string().required('PH is required'),
    color: Yup.string().required('Color is required'),
    pusCells: Yup.string().required('Pus Cells is required'),
    rbc: Yup.string().required('RBC is required'),
    agglutination: Yup.string().required('Agglutination is required'),
    totalEjaculateMillions: Yup.string().required(
      'Total Ejaculate(millions) is required',
    ),
    fructose: Yup.string().required('Fructose is required'),
    epithelialCells: Yup.string().required('Epithelial Cells is required'),
    live: Yup.string().required('Live is required'),
    dead: Yup.string().required('Dead is required'),
    impressionPhysicalAssessment: Yup.string().required(
      'Impression is required',
    ),
    normalForms: Yup.string().required('Normal Forms is required'),
    headDefects: Yup.string().required('Head Defects is required'),
    overAllDefects: Yup.string().required('Over All Defects is required'),
    midPieceAndNeckDefects: Yup.string().required(
      'Mid Piece And Neck Defects is required',
    ),
    cytoplasmicDroplets: Yup.string().required(
      'Cytoplasmic Droplets is required',
    ),
    tailDefects: Yup.string().required('Tail Defects is required'),
    defectsInHeadMidPieceNeckAndTail: Yup.string().required(
      'Defects In Head, Mid Piece-Neck & Tail is required',
    ),
    impressionMorphologyAssessment: Yup.string().required(
      'Impression is required',
    ),
    hos: Yup.string().required('HOS is required'),
    acrosomeIntactnessAI: Yup.string().required(
      'Acrosome Intactness(AI) is required',
    ),
    zonaBindingPotentialOfSpermAsPerAITesting: Yup.string().required(
      'Zona Binding Potential Of Sperm As Per AI Testing is required',
    ),
    analysis: Yup.string().required('Analysis is required'),
    description: Yup.string().required('Description is required'),
    disclaimer: Yup.string().required('Disclaimer is required'),
  }),
});

export const EarlyPregnancyValidationSchema = Yup.object().shape({
  result: Yup.object().shape({
    scanType: Yup.string().required('Scan Type is required'),
    lmpDate: Yup.date().required('LMP Date is required'),
    requestedDate: Yup.date().required('Requested Date is required'),
    dateOfScan: Yup.date().required('Date Of Scan is required'),
    embryoTransferDate: Yup.date().nullable(),
    dateOfConception: Yup.date().nullable(),
    dayOfCycle: Yup.number()
      .required('Menstrual cycle is required')
      .min(1, 'Menstrual cycle must be greater than or equal to 1'),
    modeOfConception: Yup.string().required('Mode Of Conception is required'),
    menstrualCycle: Yup.string().required('Menstrual Cycle is required'),
    bloodGroup: Yup.string(),
    BMI: Yup.string(),
    obstetricHistory: Yup.string(),
    routeOfScan: Yup.string(),
    machineModel: Yup.string(),
    view: Yup.string(),
    pregnancySite: Yup.string(),
    gestationalSac: Yup.string(), // Validation for gestational sac can be added if needed
    yolkSac: Yup.string(), // Validation for yolk sac can be added if needed
    fetalPole: Yup.string(), // Validation for fetal pole can be added if needed
    cardiacActivity: Yup.string(), // Validation for cardiac activity can be added if needed
    cervucalLength: Yup.string(), // Validation for cervical length can be added if needed
    anyOtherPathology: Yup.string(), // Validation for any other pathology can be added if needed

    rightOvary: Yup.object().shape({
      notVisualzed: Yup.boolean(),
      volume: Yup.number().when('notVisualzed', (notVisualzed, schema) => {
        return notVisualzed
          ? schema
          : schema.required('Volume is required when Ovary is not visualized');
      }),
      ovaryMeasurement: Yup.string().when(
        'notVisualzed',
        (notVisualzed, schema) => {
          return notVisualzed
            ? schema
            : schema.required(
                'Right Ovary Measurement is required when Ovary is not visualized',
              );
        },
      ),
      smallFollicles: Yup.string().when(
        'notVisualzed',
        (notVisualzed, schema) => {
          return notVisualzed
            ? schema
            : schema.required(
                'Left Ovary Small Follicles is required when Ovary is not visualized',
              );
        },
      ),
      earlyOutcome: Yup.string(), // Validation for early outcome can be added if needed
    }),

    leftOvary: Yup.object().shape({
      notVisualzed: Yup.boolean(),
      volume: Yup.number().when('notVisualzed', (notVisualzed, schema) => {
        return notVisualzed
          ? schema
          : schema.required('Volume is required when Ovary is not visualized');
      }),
      ovaryMeasurement: Yup.string().when(
        'notVisualzed',
        (notVisualzed, schema) => {
          return notVisualzed
            ? schema
            : schema.required(
                'Left Ovary Measurement is required when Ovary is not visualized',
              );
        },
      ),
      smallFollicles: Yup.string().when(
        'notVisualzed',
        (notVisualzed, schema) => {
          return notVisualzed
            ? schema
            : schema.required(
                'Left Ovary Small Follicles is required when Ovary is not visualized',
              );
        },
      ),
      earlyOutcome: Yup.string(), // Validation for early outcome can be added if needed
    }),

    impression: Yup.string(), // Validation for impression can be added if needed
    doctor: Yup.object().shape({
      _id: Yup.string().required('Doctor is required'),
      firstName: Yup.string(),
      lastName: Yup.string(),
    }),
    doctorRemarks: Yup.string(), // Validation for doctor remarks can be added if needed
    description: Yup.string(), // Validation for description can be added if needed
  }),
});
