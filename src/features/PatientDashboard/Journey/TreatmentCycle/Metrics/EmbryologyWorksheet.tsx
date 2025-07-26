import {
  Box,
  Button,
  Grid,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import ModalContext from '../../../../../context/ModalContext';
import { IPatientTreatmentCycleMetric } from '../../../../../types/patientDashboard/treatmentCycle';
import {
  useEditTreatmentCycleMutation,
  useGetTreatmentCyclesQuery,
} from '../../../../../services/patientDashboardService/treatmentCycleApi';
import { useToast } from '../../../../../context/ToastContext';
import _ from 'lodash';
import FileUploadButton from '../../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../../types/global';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import CustomDatePicker from '../../../../../components/CustomDatePicker/CustomDatePicker';
import CustomTimePicker from '../../../../../components/CustomDatePicker/CustomTimePicker';
import { DoctorSpeciality } from '../../../../../types/masterDashboard/global';
import DoctorPicker from '../../../../../components/DoctorPicker/DoctorPicker';
import FileList from '../../../../../components/FileList/FileList';

const steps = ['Day 0', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];

interface IDayMetrics {
  date: Date | null;
  checkTime: Date | null;
  checkBy: string;
  numBlastocystFormed: string;
  numEarlyBlastocystStageEmbryos: string;
  numEmbryosArrestedAtCleavageStage: string;
  numGrade3Embryos: string;
  numBlastocystFrozen: string;
  gradeOfEmbryos: string;
  numBlastocystUtilized: string;
}

interface IFormValues {
  // cycleDescription
  opuNumber: string;
  branch: string;
  bloodGroupMale: string;
  bloodGroupFemale: string;
  treatmentPlan: string;
  treatmentPlanOocytes: string;
  treatmentPlanSperm: string;
  treatmentPlanEmbryo: string;
  transfer: string;
  notesForEmbryologist: string;
  w: string;
  h: string;
  notesBy: string;
  dateOfTrigger: Date | null;
  timeOfTrigger: Date | null;
  expectedFolliclesRight: string;
  expectedFolliclesLeft: string;
  consentsChecked: string;
  opuDate: Date | null;
  opuTime: Date | null;
  doctor: string;
  assistantDoctor: string;
  embryologist: string;
  opuNeedle: string;
  mediaUsed: string;
  mediaBatchNo: string;
  checklist: string;
  reports: string;
  embryoTransferReport: string;
  oocyteAspirationReport: string;
  ivfCycleSummary: string;
  metrics: string;
  pregnancyOutcomeMetrics: string;
  embryologyWorksheet: string;
  iuiDate: Date | null;
  iuiRepeat: string;
  iuiExpiry: Date | null;
  patientIdCheck: string;
  sieveOption: string;
  numOocytesRetrievedRight: string;
  numOocytesRetrievedLeft: string;
  dishPreparationDoneBy: string;
  dishPreparationId: string;
  // spermDetails
  spermUsed: string;
  initialSpermParams: string;
  preCount: string;
  preTotalMotility: string;
  preMorphology: string;
  spermPreparationTechniques: string;
  postProcessSpermParams: string;
  postCount: string;
  postTotalProgressiveMotility: string;
  postMorphology: string;
  semenFreezingDone: string;
  spermIdCheck: string;
  icsiDish: string;
  processedBy: string;
  witness: string;
  // oocytedetails
  expectedOocytes: string;
  numOocytesCollected: string;
  miiOocytes: string;
  miOocytes: string;
  gvOocytes: string;
  // day0initialvalues
  fertilizationMethod: string;
  numOocytesSubjectedToICSI: string;
  timeOfDenudation: Date | null;
  denudationDoneBy: string;
  timeTakenForDenudation: string;
  cumulusDispersion: string;
  icsiTime: Date | null;
  timeFromOPUToICSI: string;
  timeTakenForICSI: string;
  icsiDoneBy: string;
  inseminationDoneBy: string;
  ionomycin: string;
  pentoxiphylline: string;
  oocyteQuality: string;
  notes: string;
  spermIdCheck2: string;
  witness2: string;
  eggIdCheck: string;
  postICSIDCheck: string;
  witness3: string;
  theophylline: string;
  noOfFertilizedOoctyes: string;
  noOfUnfertilizedOocytes: string;

  day0: IDayMetrics;
  day1: IDayMetrics;
  day2: IDayMetrics;
  day3: IDayMetrics;
  day4: IDayMetrics;
  day5: IDayMetrics;
  day6: IDayMetrics;

  // embryofreezing
  totalNumEmbryosFrozen: string;
  dayOfFreezing: string;
  numEmbryosVitrified: string;
  freezingConsentComplete: string;
  vitrifiedBy: string;
}

interface EmbryologyWorksheetProps {
  metric: IPatientTreatmentCycleMetric;
  treatmentCycleId: string;
}

const EmbryologyWorksheet: React.FC<EmbryologyWorksheetProps> = ({
  metric,
  treatmentCycleId,
}) => {
  const { closeModal } = useContext(ModalContext);
  const { showPromiseToast } = useToast();

  const [activeStep, setActiveStep] = useState(0);

  const patient = useSelector((state: RootState) => state.patients.patient);

  const [updateMetric, { isLoading }] = useEditTreatmentCycleMutation();

  // const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(['']);

  const {
    data: cyclesData,
    isLoading: treatmentCycleLoading,
    isFetching: treatmentCycleFetching,
  } = useGetTreatmentCyclesQuery(
    {
      filters: {
        patientCode: patient?.patientId,
      },
      sort: {
        createdAt: -1,
      },
    },
    {
      skip: !patient?.patientId,
    },
  );

  const patientTreatmentCycles = cyclesData?.data || [];

  const patientTreatmentCyclesLoading =
    treatmentCycleLoading || treatmentCycleFetching;

  // Find the specific treatment cycle by ID
  const currentTreatmentCycle = patientTreatmentCycles.find(
    cycle => cycle._id === treatmentCycleId,
  );

  // Find the specific metric by category and ID
  const currentMetric = currentTreatmentCycle?.metrics.find(
    m => m._id === metric._id,
  );

  // console.log("Current Metric:", currentMetric);

  // const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(['']);
  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(() => {
    // Initialize with an empty array by default
    let initialUrl: string[] = [];

    // Check if the file upload URL is present in the investigation details
    if (currentMetric?.details?.files) {
      initialUrl = currentMetric.details.files.flat();
    }

    return initialUrl;
  });

  const getDayMetrics = (day: number): IDayMetrics => {
    const key = `day${day}` as keyof IFormValues;

    return formik.values[key] as IDayMetrics;
  };

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleFormSubmit = async (values: IFormValues) => {
    const options = {
      conditions: {
        editType: 'update',
        category: metric.category,
      },
    };

    const payload = {
      id: treatmentCycleId,
      details: {
        ...values,
        files: fileUploadedUrl,
      },
      documentId: metric._id,
    };

    const promise = updateMetric({ payload, options }).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding Metric...',
      success: data => data.message || 'Metric Updated Successfully',
      error: data => data.message || 'Error Updating Metric',
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }
  };

  // Initial values based on the found metric
  const initialValues: IFormValues = {
    opuNumber: currentMetric?.details?.opuNumber || '',
    branch: currentMetric?.details?.branch || '',
    bloodGroupMale: currentMetric?.details?.bloodGroupMale || '',
    bloodGroupFemale: currentMetric?.details?.bloodGroupFemale || '',
    treatmentPlan: currentMetric?.details?.treatmentPlan || '',
    treatmentPlanOocytes: currentMetric?.details?.treatmentPlanOocytes || '',
    treatmentPlanSperm: currentMetric?.details?.treatmentPlanSperm || '',
    treatmentPlanEmbryo: currentMetric?.details?.treatmentPlanEmbryo || '',
    transfer: currentMetric?.details?.transfer || '',
    notesForEmbryologist: currentMetric?.details?.notesForEmbryologist || '',
    w: currentMetric?.details?.w || '',
    h: currentMetric?.details?.h || '',
    notesBy: currentMetric?.details?.notesBy || '',
    dateOfTrigger: currentMetric?.details?.dateOfTrigger || null,
    timeOfTrigger: currentMetric?.details?.timeOfTrigger || null,
    expectedFolliclesRight:
      currentMetric?.details?.expectedFolliclesRight || '',
    expectedFolliclesLeft: currentMetric?.details?.expectedFolliclesLeft || '',
    consentsChecked: currentMetric?.details?.consentsChecked || '',
    opuDate: currentMetric?.details?.opuDate || null,
    opuTime: currentMetric?.details?.opuTime || null,
    doctor: currentMetric?.details?.doctor || '',
    assistantDoctor: currentMetric?.details?.assistantDoctor || '',
    embryologist: currentMetric?.details?.embryologist || '',
    opuNeedle: currentMetric?.details?.opuNeedle || '',
    mediaUsed: currentMetric?.details?.mediaUsed || '',
    mediaBatchNo: currentMetric?.details?.mediaBatchNo || '',
    checklist: currentMetric?.details?.checklist || '',
    reports: currentMetric?.details?.reports || '',
    embryoTransferReport: currentMetric?.details?.embryoTransferReport || '',
    oocyteAspirationReport:
      currentMetric?.details?.oocyteAspirationReport || '',
    ivfCycleSummary: currentMetric?.details?.ivfCycleSummary || '',
    metrics: currentMetric?.details?.metrics || '',
    pregnancyOutcomeMetrics:
      currentMetric?.details?.pregnancyOutcomeMetrics || '',
    embryologyWorksheet: currentMetric?.details?.embryologyWorksheet || '',
    iuiDate: currentMetric?.details?.iuiDate || null,
    iuiRepeat: currentMetric?.details?.iuiRepeat || '',
    iuiExpiry: currentMetric?.details?.iuiExpiry || null,
    patientIdCheck: currentMetric?.details?.patientIdCheck || '',
    sieveOption: currentMetric?.details?.sieveOption || '',
    numOocytesRetrievedRight:
      currentMetric?.details?.numOocytesRetrievedRight || '',
    numOocytesRetrievedLeft:
      currentMetric?.details?.numOocytesRetrievedLeft || '',
    dishPreparationDoneBy: currentMetric?.details?.dishPreparationDoneBy || '',
    dishPreparationId: currentMetric?.details?.dishPreparationId || '',
    spermUsed: currentMetric?.details?.spermUsed || '',
    initialSpermParams: currentMetric?.details?.initialSpermParams || '',
    preCount: currentMetric?.details?.preCount || '',
    preTotalMotility: currentMetric?.details?.preTotalMotility || '',
    preMorphology: currentMetric?.details?.preMorphology || '',
    spermPreparationTechniques:
      currentMetric?.details?.spermPreparationTechniques || '',
    postProcessSpermParams:
      currentMetric?.details?.postProcessSpermParams || '',
    postCount: currentMetric?.details?.postCount || '',
    postTotalProgressiveMotility:
      currentMetric?.details?.postTotalProgressiveMotility || '',
    postMorphology: currentMetric?.details?.postMorphology || '',
    semenFreezingDone: currentMetric?.details?.semenFreezingDone || '',
    spermIdCheck: currentMetric?.details?.spermIdCheck || '',
    icsiDish: currentMetric?.details?.icsiDish || '',
    processedBy: currentMetric?.details?.processedBy || '',
    witness: currentMetric?.details?.witness || '',
    expectedOocytes: currentMetric?.details?.expectedOocytes || '',
    numOocytesCollected: currentMetric?.details?.numOocytesCollected || '',
    miiOocytes: currentMetric?.details?.miiOocytes || '',
    miOocytes: currentMetric?.details?.miOocytes || '',
    gvOocytes: currentMetric?.details?.gvOocytes || '',
    fertilizationMethod: currentMetric?.details?.fertilizationMethod || '',
    numOocytesSubjectedToICSI:
      currentMetric?.details?.numOocytesSubjectedToICSI || '',
    timeOfDenudation: currentMetric?.details?.timeOfDenudation || null,
    denudationDoneBy: currentMetric?.details?.denudationDoneBy || '',
    timeTakenForDenudation:
      currentMetric?.details?.timeTakenForDenudation || '',
    cumulusDispersion: currentMetric?.details?.cumulusDispersion || '',
    icsiTime: currentMetric?.details?.icsiTime || null,
    timeFromOPUToICSI: currentMetric?.details?.timeFromOPUToICSI || '',
    timeTakenForICSI: currentMetric?.details?.timeTakenForICSI || '',
    icsiDoneBy: currentMetric?.details?.icsiDoneBy || '',
    inseminationDoneBy: currentMetric?.details?.inseminationDoneBy || '',
    ionomycin: currentMetric?.details?.ionomycin || '',
    pentoxiphylline: currentMetric?.details?.pentoxiphylline || '',
    oocyteQuality: currentMetric?.details?.oocyteQuality || '',
    notes: currentMetric?.details?.notes || '',
    spermIdCheck2: currentMetric?.details?.spermIdCheck2 || '',
    witness2: currentMetric?.details?.witness2 || '',
    eggIdCheck: currentMetric?.details?.eggIdCheck || '',
    postICSIDCheck: currentMetric?.details?.postICSIDCheck || '',
    witness3: currentMetric?.details?.witness3 || '',
    theophylline: currentMetric?.details?.theophylline || '',
    noOfFertilizedOoctyes: currentMetric?.details?.noOfFertilizedOoctyes || '',
    noOfUnfertilizedOocytes:
      currentMetric?.details?.noOfUnfertilizedOocytes || '',
    day0: currentMetric?.details?.day0 || {
      date: null,
      checkTime: null,
      checkBy: '',
      numBlastocystFormed: '',
      numEarlyBlastocystStageEmbryos: '',
      numEmbryosArrestedAtCleavageStage: '',
      numGrade3Embryos: '',
      numBlastocystFrozen: '',
      gradeOfEmbryos: '',
      numBlastocystUtilized: '',
    },
    day1: currentMetric?.details?.day1 || {
      date: null,
      checkTime: null,
      checkBy: '',
      numBlastocystFormed: '',
      numEarlyBlastocystStageEmbryos: '',
      numEmbryosArrestedAtCleavageStage: '',
      numGrade3Embryos: '',
      numBlastocystFrozen: '',
      gradeOfEmbryos: '',
      numBlastocystUtilized: '',
    },
    day2: currentMetric?.details?.day2 || {
      date: null,
      checkTime: null,
      checkBy: '',
      numBlastocystFormed: '',
      numEarlyBlastocystStageEmbryos: '',
      numEmbryosArrestedAtCleavageStage: '',
      numGrade3Embryos: '',
      numBlastocystFrozen: '',
      gradeOfEmbryos: '',
      numBlastocystUtilized: '',
    },
    day3: currentMetric?.details?.day3 || {
      date: null,
      checkTime: null,
      checkBy: '',
      numBlastocystFormed: '',
      numEarlyBlastocystStageEmbryos: '',
      numEmbryosArrestedAtCleavageStage: '',
      numGrade3Embryos: '',
      numBlastocystFrozen: '',
      gradeOfEmbryos: '',
      numBlastocystUtilized: '',
    },
    day4: currentMetric?.details?.day4 || {
      date: null,
      checkTime: null,
      checkBy: '',
      numBlastocystFormed: '',
      numEarlyBlastocystStageEmbryos: '',
      numEmbryosArrestedAtCleavageStage: '',
      numGrade3Embryos: '',
      numBlastocystFrozen: '',
      gradeOfEmbryos: '',
      numBlastocystUtilized: '',
    },
    day5: currentMetric?.details?.day5 || {
      date: null,
      checkTime: null,
      checkBy: '',
      numBlastocystFormed: '',
      numEarlyBlastocystStageEmbryos: '',
      numEmbryosArrestedAtCleavageStage: '',
      numGrade3Embryos: '',
      numBlastocystFrozen: '',
      gradeOfEmbryos: '',
      numBlastocystUtilized: '',
    },
    day6: currentMetric?.details?.day6 || {
      date: null,
      checkTime: null,
      checkBy: '',
      numBlastocystFormed: '',
      numEarlyBlastocystStageEmbryos: '',
      numEmbryosArrestedAtCleavageStage: '',
      numGrade3Embryos: '',
      numBlastocystFrozen: '',
      gradeOfEmbryos: '',
      numBlastocystUtilized: '',
    },
    totalNumEmbryosFrozen: currentMetric?.details?.totalNumEmbryosFrozen || '',
    dayOfFreezing: currentMetric?.details?.dayOfFreezing || '',
    numEmbryosVitrified: currentMetric?.details?.numEmbryosVitrified || '',
    freezingConsentComplete:
      currentMetric?.details?.freezingConsentComplete || '',
    vitrifiedBy: currentMetric?.details?.vitrifiedBy || '',
  };
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    // validationSchema: EmbryologyWorksheetValidationSchema,
    enableReinitialize: true,
  });

  useEffect(() => {
    const findLastFilledStep = () => {
      for (let i = 0; i < steps.length; i++) {
        const dayKey = `day${i}` as keyof IFormValues; // Explicitly tell TypeScript the key type
        const dayData = formik.values[dayKey] as IDayMetrics;

        if (
          !_.isEmpty(dayData) &&
          Object.values(dayData).some(value => value !== null && value !== '')
        ) {
          setActiveStep(i + 1);
        }
      }
    };

    findLastFilledStep();
  }, []);

  return (
    <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
      <Typography variant="button" color="primary">
        Add {metric.name}
      </Typography>

      <Typography pt={2} variant="h6" color="primary">
        Cycle Description
      </Typography>

      {/* Cycle Description Inputs */}
      <Grid container spacing={2} mt={2}>
        <Grid item lg={4}>
          {/* <Grid item xs={12} sm={6}> */}
          <TextField
            fullWidth
            label="OPU Number"
            name="opuNumber"
            value={formik.values.opuNumber}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          {/* <Grid item xs={12} sm={6}> */}
          <TextField
            fullWidth
            label="Branch"
            name="branch"
            value={formik.values.branch}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Blood Group (Male)"
            name="bloodGroupMale"
            value={formik.values.bloodGroupMale}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Blood Group (Female)"
            name="bloodGroupFemale"
            value={formik.values.bloodGroupFemale}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="treatmentPlan"
            name="treatmentPlan"
            label="Treatment Plan"
            value={formik.values.treatmentPlan}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="treatmentPlanOocytes"
            name="treatmentPlanOocytes"
            label="Treatment Plan - Oocytes"
            value={formik.values.treatmentPlanOocytes}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="treatmentPlanSperm"
            name="treatmentPlanSperm"
            label="Treatment Plan - Sperm"
            value={formik.values.treatmentPlanSperm}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="treatmentPlanEmbryo"
            name="treatmentPlanEmbryo"
            label="Treatment Plan - Embryo"
            value={formik.values.treatmentPlanEmbryo}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="transfer"
            name="transfer"
            label="Transfer"
            value={formik.values.transfer}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows="4"
            id="notesForEmbryologist"
            name="notesForEmbryologist"
            label="Notes for Embryologist"
            value={formik.values.notesForEmbryologist}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item lg={4}>
          <TextField
            fullWidth
            id="notesBy"
            name="notesBy"
            label="Notes By"
            value={formik.values.notesBy}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item lg={4}>
          <CustomDatePicker
            label="Date of Trigger"
            value={formik.values.dateOfTrigger}
            onChange={date => formik.setFieldValue('dateOfTrigger', date, true)}
          />
        </Grid>
        <Grid item lg={4}>
          <CustomTimePicker
            label="Time of Trigger"
            value={formik.values.timeOfTrigger}
            onChange={time => formik.setFieldValue('timeOfTrigger', time, true)}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="expectedFolliclesRight"
            name="expectedFolliclesRight"
            label="Expected Follicles - Right"
            value={formik.values.expectedFolliclesRight}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="expectedFolliclesLeft"
            name="expectedFolliclesLeft"
            label="Expected Follicles - Left"
            value={formik.values.expectedFolliclesLeft}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            select
            id="consentsChecked"
            name="consentsChecked"
            label="Consents Checked"
            value={formik.values.consentsChecked}
            onChange={formik.handleChange}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>
        </Grid>

        <Grid item lg={4}>
          <CustomDatePicker
            label="OPU Date"
            value={formik.values.opuDate}
            onChange={date => formik.setFieldValue('opuDate', date, true)}
          />
        </Grid>
        <Grid item lg={4}>
          <CustomTimePicker
            label="OPU Time"
            value={formik.values.opuTime}
            onChange={time => formik.setFieldValue('opuTime', time, true)}
          />
        </Grid>
        <Grid item lg={4}>
          <DoctorPicker
            formState={formik}
            fieldName={`doctor`}
            label="Doctor"
            error={formik.touched.doctor && Boolean(formik.errors.doctor)}
            helperText={
              formik.touched.doctor ? formik.errors.doctor : undefined
            }
          />
        </Grid>
        <Grid item lg={4}>
          <DoctorPicker
            formState={formik}
            fieldName={`assistantDoctor`}
            label="Assistant Doctor"
            error={
              formik.touched.assistantDoctor &&
              Boolean(formik.errors.assistantDoctor)
            }
            helperText={
              formik.touched.assistantDoctor
                ? formik.errors.assistantDoctor
                : undefined
            }
          />
        </Grid>
        <Grid item lg={4}>
          {/* <TextField
            fullWidth
            id="embryologist"
            name="embryologist"
            label="Embryologist"
            value={formik.values.embryologist}
            onChange={formik.handleChange}
          /> */}
          <DoctorPicker
            formState={formik}
            fieldName={`embryologist`}
            label="Embryologist"
            error={
              formik.touched.embryologist && Boolean(formik.errors.embryologist)
            }
            helperText={
              formik.touched.embryologist
                ? formik.errors.embryologist
                : undefined
            }
            speciality={DoctorSpeciality.Embryologist}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="opuNeedle"
            name="opuNeedle"
            label="OPU Needle"
            value={formik.values.opuNeedle}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="mediaUsed"
            name="mediaUsed"
            label="Media Used"
            value={formik.values.mediaUsed}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="mediaBatchNo"
            name="mediaBatchNo"
            label="Media Batch No"
            value={formik.values.mediaBatchNo}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item lg={4}>
          <CustomDatePicker
            label="Expiry Date"
            value={formik.values.iuiExpiry}
            onChange={date => formik.setFieldValue('iuiExpiry', date, true)}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="patientIdCheck"
            name="patientIdCheck"
            label="Patient ID Check"
            value={formik.values.patientIdCheck}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="sieveOption"
            name="sieveOption"
            label="Sieve Option"
            value={formik.values.sieveOption}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="numOocytesRetrievedRight"
            name="numOocytesRetrievedRight"
            label="Number of Oocytes Retrieved (Right)"
            value={formik.values.numOocytesRetrievedRight}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="numOocytesRetrievedLeft"
            name="numOocytesRetrievedLeft"
            label="Number of Oocytes Retrieved (Left)"
            value={formik.values.numOocytesRetrievedLeft}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="dishPreparationDoneBy"
            name="dishPreparationDoneBy"
            label="Dish Preparation Done By"
            value={formik.values.dishPreparationDoneBy}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="dishPreparationId"
            name="dishPreparationId"
            label="Dish Preparation ID"
            value={formik.values.dishPreparationId}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid container>
          <Typography variant="h6" pt={2} pl={2} color="primary">
            Sperm Details
          </Typography>
        </Grid>

        <Grid item lg={4}>
          <TextField
            fullWidth
            id="spermUsed"
            name="spermUsed"
            label="Sperm Used"
            value={formik.values.spermUsed}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item lg={4}>
          <TextField
            fullWidth
            id="initialSpermParams"
            name="initialSpermParams"
            label="Initial Sperm Parameters"
            value={formik.values.initialSpermParams}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="preCount"
            name="preCount"
            label="Pre Count - Millions/ml "
            value={formik.values.preCount}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="preTotalMotility"
            name="preTotalMotility"
            label="Pre Total Motility %"
            value={formik.values.preTotalMotility}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="preMorphology"
            name="preMorphology"
            label="Pre Morphology %"
            value={formik.values.preMorphology}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="spermPreparationTechniques"
            name="spermPreparationTechniques"
            label="Sperm Preparation Techniques"
            value={formik.values.spermPreparationTechniques}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="postProcessSpermParams"
            name="postProcessSpermParams"
            label="Post Process Sperm Parameters"
            value={formik.values.postProcessSpermParams}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="postCount"
            name="postCount"
            label="Post Count (Millions/ml) "
            value={formik.values.postCount}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="postTotalProgressiveMotility"
            name="postTotalProgressiveMotility"
            label="Post Total Progressive Motility %"
            value={formik.values.postTotalProgressiveMotility}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="postMorphology"
            name="postMorphology"
            label="Post Morphology %"
            value={formik.values.postMorphology}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="semenFreezingDone"
            name="semenFreezingDone"
            label="Semen Freezing Done"
            value={formik.values.semenFreezingDone}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="spermIdCheck"
            name="spermIdCheck"
            label="Sperm ID Check"
            value={formik.values.spermIdCheck}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="icsiDish"
            name="icsiDish"
            label="ICSI Dish"
            value={formik.values.icsiDish}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="processedBy"
            name="processedBy"
            label="Processed By"
            value={formik.values.processedBy}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="witness"
            name="witness"
            label="Witness"
            value={formik.values.witness}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid container>
          <Typography variant="h6" pt={2} pl={2} color="primary">
            Oocyte Details
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="expectedOocytes"
            name="expectedOocytes"
            label="Expected Oocytes"
            value={formik.values.expectedOocytes}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="numOocytesCollected"
            name="numOocytesCollected"
            label="Number of Oocytes Collected"
            value={formik.values.numOocytesCollected}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="miiOocytes"
            name="miiOocytes"
            label="MII Oocytes"
            value={formik.values.miiOocytes}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="miOocytes"
            name="miOocytes"
            label="MI Oocytes"
            value={formik.values.miOocytes}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="gvOocytes"
            name="gvOocytes"
            label="GV Oocytes"
            value={formik.values.gvOocytes}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid container>
          <Typography variant="h6" pt={2} pl={2} color="primary">
            Embryo Freezing
          </Typography>
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="totalNumEmbryosFrozen"
            name="totalNumEmbryosFrozen"
            label="Total Number of Embryos Frozen"
            value={formik.values.totalNumEmbryosFrozen}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="dayOfFreezing"
            name="dayOfFreezing"
            label="Day of Freezing"
            value={formik.values.dayOfFreezing}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="numEmbryosVitrified"
            name="numEmbryosVitrified"
            label="Number of Embryos Vitrified"
            value={formik.values.numEmbryosVitrified}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="freezingConsentComplete"
            name="freezingConsentComplete"
            label="Freezing Consent Complete"
            value={formik.values.freezingConsentComplete}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            id="vitrifiedBy"
            name="vitrifiedBy"
            label="Vitrified By"
            value={formik.values.vitrifiedBy}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>

      <Grid pt={5}></Grid>

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} onClick={handleStep(index)}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box mt={2}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6">Day 0</Typography>
            <Grid container spacing={2}>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Method of Fertilization"
                  name="fertilizationMethod"
                  value={formik.values.fertilizationMethod}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="No. of Oocytes subjected to ICSI"
                  name="numOocytesSubjectedToICSI"
                  value={formik.values.numOocytesSubjectedToICSI}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <CustomTimePicker
                  label="Time of Denudation"
                  value={formik.values.timeOfDenudation}
                  onChange={value =>
                    formik.setFieldValue('timeOfDenudation', value)
                  }
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Denudation done by"
                  name="denudationDoneBy"
                  value={formik.values.denudationDoneBy}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Time taken for Denudation"
                  name="timeTakenForDenudation"
                  value={formik.values.timeTakenForDenudation}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Cumulus Dispersion"
                  name="cumulusDispersion"
                  value={formik.values.cumulusDispersion}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <CustomTimePicker
                  label="ICSI Time"
                  value={formik.values.icsiTime}
                  onChange={value => formik.setFieldValue('icsiTime', value)}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Time from OPU to ICSI (hh:mm) "
                  name="timeFromOPUToICSI"
                  value={formik.values.timeFromOPUToICSI}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Time taken for ICSI (in mins)"
                  name="timeTakenForICSI"
                  value={formik.values.timeTakenForICSI}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="ICSI Done By"
                  name="icsiDoneBy"
                  value={formik.values.icsiDoneBy}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Insemination done by"
                  name="inseminationDoneBy"
                  value={formik.values.inseminationDoneBy}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Ionomycin"
                  name="ionomycin"
                  value={formik.values.ionomycin}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Pentoxiphylline"
                  name="pentoxiphylline"
                  value={formik.values.pentoxiphylline}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  multiline
                  label="Oocyte Quality"
                  name="oocyteQuality"
                  value={formik.values.oocyteQuality}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid container pt={2} pl={2}>
                {/* <Grid item lg={4}> */}
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Notes"
                  name="notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                />
                {/* </Grid> */}
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Sperm ID Check"
                  name="spermIdCheck2"
                  value={formik.values.spermIdCheck2}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Witness"
                  name="witness2"
                  value={formik.values.witness2}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Egg ID Check"
                  name="eggIdCheck"
                  value={formik.values.eggIdCheck}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Post ICSI ID Check"
                  name="postICSIDCheck"
                  value={formik.values.postICSIDCheck}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Witness"
                  name="witness3"
                  value={formik.values.witness3}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Theophylline"
                  name="theophylline"
                  value={formik.values.theophylline}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Number of Fertilized Oocytes"
                  name="noOfFertilizedOocytes"
                  value={formik.values.noOfFertilizedOoctyes}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Number of Unfertilized Oocytes"
                  name="noOfUnfertilizedOocytes"
                  value={formik.values.noOfUnfertilizedOocytes}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        {activeStep > 0 && activeStep <= 6 && (
          <Box>
            <Typography variant="h6">{`Day ${activeStep}`}</Typography>
            <Grid container spacing={2}>
              <Grid item lg={4}>
                <CustomDatePicker
                  label="Date"
                  // value={(formik.values[`day${activeStep}`] as IDayMetrics).date}
                  value={getDayMetrics(activeStep).date}
                  onChange={value =>
                    formik.setFieldValue(`day${activeStep}.date`, value)
                  }
                />
              </Grid>

              <Grid item lg={4}>
                <CustomTimePicker
                  label="Check Time"
                  // value={formik.values[`day${activeStep}`].checkTime}
                  value={getDayMetrics(activeStep).checkTime}
                  onChange={value =>
                    formik.setFieldValue(`day${activeStep}.checkTime`, value)
                  }
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Check By"
                  name={`day${activeStep}.checkBy`}
                  // value={formik.values[`day${activeStep}`].checkBy}
                  value={getDayMetrics(activeStep).checkBy}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Total number of blastocyst formed"
                  name={`day${activeStep}.numBlastocystFormed`}
                  // value={formik.values[`day${activeStep}`].numBlastocystFormed}
                  value={getDayMetrics(activeStep).numBlastocystFormed}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="No. of early blastocyst stage embryos"
                  name={`day${activeStep}.numEarlyBlastocystStageEmbryos`}
                  // value={formik.values[`day${activeStep}`].numEarlyBlastocystStageEmbryos}
                  value={
                    getDayMetrics(activeStep).numEarlyBlastocystStageEmbryos
                  }
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="No. of embryos arrested at cleavage stage"
                  name={`day${activeStep}.numEmbryosArrestedAtCleavageStage`}
                  // value={formik.values[`day${activeStep}`].numEmbryosArrestedAtCleavageStage}
                  value={
                    getDayMetrics(activeStep).numEmbryosArrestedAtCleavageStage
                  }
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="No. of Grade 3 embryos"
                  name={`day${activeStep}.numGrade3Embryos`}
                  // value={formik.values[`day${activeStep}`].numGrade3Embryos}
                  value={getDayMetrics(activeStep).numGrade3Embryos}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Total number of blastocyst frozen"
                  name={`day${activeStep}.numBlastocystFrozen`}
                  // value={formik.values[`day${activeStep}`].numBlastocystFrozen}
                  value={getDayMetrics(activeStep).numBlastocystFrozen}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Grade of embryos"
                  name={`day${activeStep}.gradeOfEmbryos`}
                  // value={formik.values[`day${activeStep}`].gradeOfEmbryos}
                  value={getDayMetrics(activeStep).gradeOfEmbryos}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  label="Total number of blastocyst utilized"
                  name={`day${activeStep}.numBlastocystUtilized`}
                  // value={formik.values[`day${activeStep}`].numBlastocystUtilized}
                  value={getDayMetrics(activeStep).numBlastocystUtilized}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        <Box mt={2}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              activeStep === steps.length - 1
                ? formik.handleSubmit()
                : handleNext()
            }
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>

      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Upload Report
        </Typography>
        {/* <Grid container spacing={2} marginBottom={2}> */}
        <Grid item xs={12}>
          {patient && (
            <FileUploadButton
              acceptTypes="image/*"
              maxFiles={30}
              maxFileSizeinMB={15}
              onUploadFiles={setFileUploadedUrl}
              bucket={EBuckets.UserReports}
              documentType={EDocumentTypes.TreatmentCycle}
              user={patient?._id}
              reportId={treatmentCycleId}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          {fileUploadedUrl.length > 0 && (
            <FileList
              files={fileUploadedUrl}
              title="Uploaded Files"
              bucket={EBuckets.UserReports}
              documentType={EDocumentTypes.TreatmentCycle}
              reportId={treatmentCycleId}
            />
          )}
        </Grid>
      </Grid>
      <Box
        display={'flex'}
        justifyContent={'flex-end'}
        alignItems={'center'}
        gap={2}
        mb={2}
      >
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={
            isLoading ||
            patientTreatmentCyclesLoading ||
            (_.isEqual(formik.values, formik.initialValues) &&
              fileUploadedUrl.length === 0)
          }
          sx={{ width: 'fit-content' }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: 'fit-content' }}
          onClick={closeModal}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EmbryologyWorksheet;
