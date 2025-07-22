import React, { useContext } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import FileUploadButton from '../../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../../types/global';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import { useToast } from '../../../../../context/ToastContext';
import ModalContext from '../../../../../context/ModalContext';
import {
  useEditTreatmentCycleMutation,
  useGetTreatmentCyclesQuery,
} from '../../../../../services/patientDashboardService/treatmentCycleApi';
import { IPatientTreatmentCycleReport } from '../../../../../types/patientDashboard/treatmentCycle';
import _ from 'lodash';
import CustomDatePicker from '../../../../../components/CustomDatePicker/CustomDatePicker';
import CustomTimePicker from '../../../../../components/CustomDatePicker/CustomTimePicker';
import { DoctorSpeciality } from '../../../../../types/masterDashboard/global';
import DoctorPicker from '../../../../../components/DoctorPicker/DoctorPicker';
import FileList from '../../../../../components/FileList/FileList';

interface IFormValues {
  preTreatments: string;
  AddonDrug: string;
  DaysofpreTreatment: string;
  LMP: Date | null;
  PreTreatmentsComments: string;
  stimulationProtocol: string;
  daysOfStimulation: string;
  dateOfStimulation: Date | null;
  oralStimulatingAgents: string;
  downRegulationDays: string;
  downRegulationDate: Date | null;
  downRegulationE2: string;
  downRegulationEndometrialThickness: string;

  rFSHDosage: string;
  rLHDosage: string;
  hpHMGDosage: string;
  hpFSHDosage: string;
  totalGonadotrophinDose: string;

  deviationsDuringCycle: string;
  endometrialThickness: string;
  fluidInCavity: string;
  interventionsDuringCycle: string;
  growthHormoneDosage: string;

  trigger: string;
  triggerComments: string;
  triggerDate: Date | null;
  triggerTime: Date | null;
  repeatTrigger: string;
  preTriggerE2: string;
  preTriggerLH: string;
  preTriggerProgesterone: string;
  postTriggerLH: string;
  postTriggerProgesterone: string;
  postTriggerBHCG: string;
  e2DayOfTrigger: string;
  endometrialThicknessDayOfTrigger: string;

  opuDate: Date | null;
  opuTime: Date | null;
  totalDose: string;
  surgeon: string;
  anaesthetist: string;
  otherSurgeons: string;
  selfDonor: string;
  differenceTriggerOPU: string;
  folliclesAtTrigger: string;
  oocytesRetrieved: string;
  matureOocytes: string;
  immatureOocytes: string;
  oocyteQuality: string;
  specificAbnormalities: string;

  Freezing: string;
  description: string;
}

interface OPUReportProps {
  report: IPatientTreatmentCycleReport;
  treatmentCycleId: string;
}

const OocyteAspirationReportForm: React.FC<OPUReportProps> = ({
  report,
  treatmentCycleId,
}) => {
  // const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(['']);

  const patient = useSelector((state: RootState) => state.patients.patient);

  const { closeModal } = useContext(ModalContext);
  const { showPromiseToast } = useToast();

  const [updateOPUReport, { isLoading }] = useEditTreatmentCycleMutation();

  const { data: treatmentCyclesData } = useGetTreatmentCyclesQuery(
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

  const patientTreatmentCycles = treatmentCyclesData?.data || [];

  // Find the specific treatment cycle by ID
  const currentTreatmentCycle = patientTreatmentCycles.find(
    cycle => cycle._id === treatmentCycleId,
  );

  // Find the specific report by category and ID
  const currentReport = currentTreatmentCycle?.reports.find(
    r => r._id === report._id,
  );

  console.log('Current Report:', currentReport);

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(() => {
    // Initialize with an empty array by default
    let initialUrl: string[] = [];

    // Check if the file upload URL is present in the investigation details
    if (currentReport?.details?.files) {
      initialUrl = currentReport.details.files.flat();
    }

    return initialUrl;
  });

  const initialValues: IFormValues = {
    preTreatments: currentReport?.details?.preTreatments || '',
    AddonDrug: currentReport?.details?.AddonDrug || '',
    DaysofpreTreatment: currentReport?.details?.DaysofpreTreatment || '',
    LMP: currentReport?.details?.LMP
      ? new Date(currentReport.details.LMP)
      : null,
    PreTreatmentsComments: currentReport?.details?.PreTreatmentsComments || '',
    stimulationProtocol: currentReport?.details?.stimulationProtocol || '',
    daysOfStimulation: currentReport?.details?.daysOfStimulation || '',
    dateOfStimulation: currentReport?.details?.dateOfStimulation
      ? new Date(currentReport.details.dateOfStimulation)
      : null,
    oralStimulatingAgents: currentReport?.details?.oralStimulatingAgents || '',
    rFSHDosage: currentReport?.details?.rFSHDosage || '',
    rLHDosage: currentReport?.details?.rLHDosage || '',
    hpHMGDosage: currentReport?.details?.hpHMGDosage || '',
    hpFSHDosage: currentReport?.details?.hpFSHDosage || '',
    totalGonadotrophinDose:
      currentReport?.details?.totalGonadotrophinDose || '',
    downRegulationDays: currentReport?.details?.downRegulationDays || '',
    downRegulationDate: currentReport?.details?.downRegulationDate || '',
    downRegulationE2: currentReport?.details?.downRegulationE2 || '',
    downRegulationEndometrialThickness:
      currentReport?.details?.downRegulationEndometrialThickness || '',
    deviationsDuringCycle: currentReport?.details?.deviationsDuringCycle || '',
    endometrialThickness: currentReport?.details?.endometrialThickness || '',
    fluidInCavity: currentReport?.details?.fluidInCavity || '',
    interventionsDuringCycle:
      currentReport?.details?.interventionsDuringCycle || '',
    growthHormoneDosage: currentReport?.details?.growthHormoneDosage || '',
    trigger: currentReport?.details?.trigger || '',
    triggerComments: currentReport?.details?.triggerComments || '',
    triggerDate: currentReport?.details?.triggerDate
      ? new Date(currentReport.details.triggerDate)
      : null,
    triggerTime: currentReport?.details?.triggerTime
      ? new Date(currentReport.details.triggerTime)
      : null,
    repeatTrigger: currentReport?.details?.repeatTrigger || '',
    preTriggerE2: currentReport?.details?.preTriggerE2 || '',
    preTriggerLH: currentReport?.details?.preTriggerLH || '',
    preTriggerProgesterone:
      currentReport?.details?.preTriggerProgesterone || '',
    postTriggerLH: currentReport?.details?.postTriggerLH || '',
    postTriggerProgesterone:
      currentReport?.details?.postTriggerProgesterone || '',
    postTriggerBHCG: currentReport?.details?.postTriggerBHCG || '',
    e2DayOfTrigger: currentReport?.details?.e2DayOfTrigger || '',
    endometrialThicknessDayOfTrigger:
      currentReport?.details?.endometrialThicknessDayOfTrigger || '',
    opuDate: currentReport?.details?.opuDate
      ? new Date(currentReport.details.opuDate)
      : null,
    opuTime: currentReport?.details?.opuTime
      ? new Date(currentReport.details.opuTime)
      : null,
    totalDose: currentReport?.details?.totalDose || '',
    surgeon: currentReport?.details?.surgeon || '',
    anaesthetist: currentReport?.details?.anaesthetist || null,
    otherSurgeons: currentReport?.details?.otherSurgeons || '',
    selfDonor: currentReport?.details?.selfDonor || '',
    differenceTriggerOPU: currentReport?.details?.differenceTriggerOPU || '',
    folliclesAtTrigger: currentReport?.details?.folliclesAtTrigger || '',
    oocytesRetrieved: currentReport?.details?.oocytesRetrieved || '',
    matureOocytes: currentReport?.details?.matureOocytes || '',
    immatureOocytes: currentReport?.details?.matureOocytes || '',
    oocyteQuality: currentReport?.details?.oocyteQuality || '',
    specificAbnormalities: currentReport?.details?.immatureOocytes || '',

    Freezing: currentReport?.details?.Freezing || '',
    description: currentReport?.details?.description || '',
  };

  const handleFormSubmit = async (values: IFormValues) => {
    const options = {
      conditions: {
        editType: 'update',
        category: report.category,
      },
    };

    const payload = {
      id: treatmentCycleId,
      details: {
        ...values,
      },
      files: fileUploadedUrl,
      documentId: report._id,
    };

    const promise = updateOPUReport({ payload, options }).unwrap();

    showPromiseToast(promise, {
      loading: 'Saving OPU Report...',
      success: data => data.message || 'OPU Report Updated Successfully',
      error: data => data.message || 'Error Updating OPU Report',
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    // validationSchema: IVFChecklistValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} p={2}>
      <Typography variant="h6" color="primary">
        Oocyte Aspiration Report
      </Typography>

      <Typography variant="h6" color="primary" pt={2}>
        Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item lg={4}>
          <TextField
            name="preTreatments"
            label="Pre Treatment"
            fullWidth
            value={formik.values.preTreatments}
            onChange={formik.handleChange}
            error={
              formik.touched.preTreatments &&
              Boolean(formik.errors.preTreatments)
            }
            helperText={
              formik.touched.preTreatments && formik.errors.preTreatments
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="AddonDrug"
            label="Add-on Drug"
            fullWidth
            value={formik.values.AddonDrug}
            onChange={formik.handleChange}
            error={formik.touched.AddonDrug && Boolean(formik.errors.AddonDrug)}
            helperText={formik.touched.AddonDrug && formik.errors.AddonDrug}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="DaysofpreTreatment"
            label="Days of Pre-Treatment"
            fullWidth
            type="number"
            value={formik.values.DaysofpreTreatment}
            onChange={formik.handleChange}
            error={
              formik.touched.DaysofpreTreatment &&
              Boolean(formik.errors.DaysofpreTreatment)
            }
            helperText={
              formik.touched.DaysofpreTreatment &&
              formik.errors.DaysofpreTreatment
            }
          />
        </Grid>
        <Grid item lg={4}>
          <CustomDatePicker
            label="LMP Date"
            name="LMP"
            value={formik.values.LMP}
            onChange={date => formik.setFieldValue('LMP', date)}
            error={formik.touched.LMP && Boolean(formik.errors.LMP)}
          />
        </Grid>
        <Grid container pl={2} pt={2}>
          <Grid item xs={12}>
            <TextField
              name="PreTreatmentsComments"
              label="Pre-Treatment Comments"
              multiline
              minRows={2}
              fullWidth
              value={formik.values.PreTreatmentsComments}
              onChange={formik.handleChange}
              error={
                formik.touched.PreTreatmentsComments &&
                Boolean(formik.errors.PreTreatmentsComments)
              }
              helperText={
                formik.touched.PreTreatmentsComments &&
                formik.errors.PreTreatmentsComments
              }
            />
          </Grid>
        </Grid>
      </Grid>

      <Typography variant="h6" color="primary" pt={2}>
        Stimulation
      </Typography>
      <Grid container spacing={2}>
        <Grid item lg={4}>
          <TextField
            name="stimulationProtocol"
            label="Stimulation Protocol"
            fullWidth
            value={formik.values.stimulationProtocol}
            onChange={formik.handleChange}
            error={
              formik.touched.stimulationProtocol &&
              Boolean(formik.errors.stimulationProtocol)
            }
            helperText={
              formik.touched.stimulationProtocol &&
              formik.errors.stimulationProtocol
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="daysOfStimulation"
            label="Days of Stimulation"
            fullWidth
            type="number"
            value={formik.values.daysOfStimulation}
            onChange={formik.handleChange}
            error={
              formik.touched.daysOfStimulation &&
              Boolean(formik.errors.daysOfStimulation)
            }
            helperText={
              formik.touched.daysOfStimulation &&
              formik.errors.daysOfStimulation
            }
          />
        </Grid>
        <Grid item lg={4}>
          <CustomDatePicker
            label="Date of Stimulation"
            name="dateOfStimulation"
            value={formik.values.dateOfStimulation}
            onChange={date => formik.setFieldValue('dateOfStimulation', date)}
            error={
              formik.touched.dateOfStimulation &&
              Boolean(formik.errors.dateOfStimulation)
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="oralStimulatingAgents"
            label="Oral Stimulating Agents"
            fullWidth
            value={formik.values.oralStimulatingAgents}
            onChange={formik.handleChange}
            error={
              formik.touched.oralStimulatingAgents &&
              Boolean(formik.errors.oralStimulatingAgents)
            }
            helperText={
              formik.touched.oralStimulatingAgents &&
              formik.errors.oralStimulatingAgents
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="downRegulationDays"
            label="Down Regulation Days"
            fullWidth
            type="number"
            value={formik.values.downRegulationDays}
            onChange={formik.handleChange}
            error={
              formik.touched.downRegulationDays &&
              Boolean(formik.errors.downRegulationDays)
            }
            helperText={
              formik.touched.downRegulationDays &&
              formik.errors.downRegulationDays
            }
          />
        </Grid>
        <Grid item lg={4}>
          <CustomDatePicker
            label="Down Regulation Date"
            name="downRegulationDate"
            value={formik.values.downRegulationDate}
            onChange={date => formik.setFieldValue('downRegulationDate', date)}
            error={
              formik.touched.downRegulationDate &&
              Boolean(formik.errors.downRegulationDate)
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="downRegulationE2"
            label="Down Regulation E2/Day 2 E2"
            fullWidth
            value={formik.values.downRegulationE2}
            onChange={formik.handleChange}
            error={
              formik.touched.downRegulationE2 &&
              Boolean(formik.errors.downRegulationE2)
            }
            helperText={
              formik.touched.downRegulationE2 && formik.errors.downRegulationE2
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="downRegulationEndometrialThickness"
            label="Down Regulation/Day2-Endometrial Thickness"
            fullWidth
            value={formik.values.downRegulationEndometrialThickness}
            onChange={formik.handleChange}
            error={
              formik.touched.downRegulationEndometrialThickness &&
              Boolean(formik.errors.downRegulationEndometrialThickness)
            }
            helperText={
              formik.touched.downRegulationEndometrialThickness &&
              formik.errors.downRegulationEndometrialThickness
            }
          />
        </Grid>
        <Grid container spacing={2} pt={2} pl={4}>
          <Typography variant="h6" color="primary" pt={2}>
            Hormones
          </Typography>
        </Grid>
        <Grid container spacing={2} pl={2}>
          <Grid item lg={4}>
            <TextField
              name="rFSHDosage"
              label="rFSH Dosage"
              fullWidth
              value={formik.values.rFSHDosage}
              onChange={formik.handleChange}
              error={
                formik.touched.rFSHDosage && Boolean(formik.errors.rFSHDosage)
              }
              helperText={formik.touched.rFSHDosage && formik.errors.rFSHDosage}
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="rLHDosage"
              label="rLH Dosage"
              fullWidth
              value={formik.values.rLHDosage}
              onChange={formik.handleChange}
              error={
                formik.touched.rLHDosage && Boolean(formik.errors.rLHDosage)
              }
              helperText={formik.touched.rLHDosage && formik.errors.rLHDosage}
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="hpHMGDosage"
              label="HP hMG Dosage"
              fullWidth
              value={formik.values.hpHMGDosage}
              onChange={formik.handleChange}
              error={
                formik.touched.hpHMGDosage && Boolean(formik.errors.hpHMGDosage)
              }
              helperText={
                formik.touched.hpHMGDosage && formik.errors.hpHMGDosage
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="hpFSHDosage"
              label="HP-FSH Dosage"
              fullWidth
              value={formik.values.hpFSHDosage}
              onChange={formik.handleChange}
              error={
                formik.touched.hpFSHDosage && Boolean(formik.errors.hpFSHDosage)
              }
              helperText={
                formik.touched.hpFSHDosage && formik.errors.hpFSHDosage
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="totalGonadotrophinDose"
              label="Total Gonadotrophin Dose"
              fullWidth
              value={formik.values.totalGonadotrophinDose}
              onChange={formik.handleChange}
              error={
                formik.touched.totalGonadotrophinDose &&
                Boolean(formik.errors.totalGonadotrophinDose)
              }
              helperText={
                formik.touched.totalGonadotrophinDose &&
                formik.errors.totalGonadotrophinDose
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="deviationsDuringCycle"
              label="Deviations During Cycle"
              fullWidth
              value={formik.values.deviationsDuringCycle}
              onChange={formik.handleChange}
              error={
                formik.touched.deviationsDuringCycle &&
                Boolean(formik.errors.deviationsDuringCycle)
              }
              helperText={
                formik.touched.deviationsDuringCycle &&
                formik.errors.deviationsDuringCycle
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="endometrialThickness"
              label="Endometrial Thickness in mm"
              fullWidth
              value={formik.values.endometrialThickness}
              onChange={formik.handleChange}
              error={
                formik.touched.endometrialThickness &&
                Boolean(formik.errors.endometrialThickness)
              }
              helperText={
                formik.touched.endometrialThickness &&
                formik.errors.endometrialThickness
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="fluidInCavity"
              label="Fluid in Cavity"
              fullWidth
              value={formik.values.fluidInCavity}
              onChange={formik.handleChange}
              error={
                formik.touched.fluidInCavity &&
                Boolean(formik.errors.fluidInCavity)
              }
              helperText={
                formik.touched.fluidInCavity && formik.errors.fluidInCavity
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="interventionsDuringCycle"
              label="Interventions During Cycle"
              fullWidth
              value={formik.values.interventionsDuringCycle}
              onChange={formik.handleChange}
              error={
                formik.touched.interventionsDuringCycle &&
                Boolean(formik.errors.interventionsDuringCycle)
              }
              helperText={
                formik.touched.interventionsDuringCycle &&
                formik.errors.interventionsDuringCycle
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="growthHormoneDosage"
              label="Growth Hormone Dosage"
              fullWidth
              value={formik.values.growthHormoneDosage}
              onChange={formik.handleChange}
              error={
                formik.touched.growthHormoneDosage &&
                Boolean(formik.errors.growthHormoneDosage)
              }
              helperText={
                formik.touched.growthHormoneDosage &&
                formik.errors.growthHormoneDosage
              }
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} pt={4} pl={4}>
          <Typography variant="h6" color="primary">
            Trigger
          </Typography>
        </Grid>

        <Grid container spacing={2} pl={2}>
          <Grid item lg={4}>
            <TextField
              name="trigger"
              label="Trigger"
              fullWidth
              value={formik.values.trigger}
              onChange={formik.handleChange}
              error={formik.touched.trigger && Boolean(formik.errors.trigger)}
              helperText={formik.touched.trigger && formik.errors.trigger}
            />
          </Grid>

          <Grid item lg={4}>
            <CustomDatePicker
              label="Trigger Date"
              name="triggerDate"
              value={formik.values.triggerDate}
              onChange={date => formik.setFieldValue('triggerDate', date)}
              error={
                formik.touched.triggerDate && Boolean(formik.errors.triggerDate)
              }
            />
          </Grid>
          <Grid item lg={4}>
            <CustomTimePicker
              label="Trigger Time"
              value={formik.values.triggerTime}
              onChange={date => formik.setFieldValue('triggerTime', date)}
              error={
                formik.touched.triggerTime && Boolean(formik.errors.triggerTime)
              }
            />
          </Grid>
          <Grid container pl={2} pt={2}>
            <Grid item xs={12}>
              <TextField
                name="triggerComments"
                label="Trigger Comments"
                fullWidth
                multiline
                minRows={2}
                value={formik.values.triggerComments}
                onChange={formik.handleChange}
                error={
                  formik.touched.triggerComments &&
                  Boolean(formik.errors.triggerComments)
                }
                helperText={
                  formik.touched.triggerComments &&
                  formik.errors.triggerComments
                }
              />
            </Grid>
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="repeatTrigger"
              label="Repeat 12 hrs trigger"
              fullWidth
              value={formik.values.repeatTrigger}
              onChange={formik.handleChange}
              error={
                formik.touched.repeatTrigger &&
                Boolean(formik.errors.repeatTrigger)
              }
              helperText={
                formik.touched.repeatTrigger && formik.errors.repeatTrigger
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="preTriggerE2"
              label="Pre trigger - E2"
              fullWidth
              value={formik.values.preTriggerE2}
              onChange={formik.handleChange}
              error={
                formik.touched.preTriggerE2 &&
                Boolean(formik.errors.preTriggerE2)
              }
              helperText={
                formik.touched.preTriggerE2 && formik.errors.preTriggerE2
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="preTriggerLH"
              label="Pre trigger - LH"
              fullWidth
              value={formik.values.preTriggerLH}
              onChange={formik.handleChange}
              error={
                formik.touched.preTriggerLH &&
                Boolean(formik.errors.preTriggerLH)
              }
              helperText={
                formik.touched.preTriggerLH && formik.errors.preTriggerLH
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="preTriggerProgesterone"
              label="Pre trigger - Progesterone"
              fullWidth
              value={formik.values.preTriggerProgesterone}
              onChange={formik.handleChange}
              error={
                formik.touched.preTriggerProgesterone &&
                Boolean(formik.errors.preTriggerProgesterone)
              }
              helperText={
                formik.touched.preTriggerProgesterone &&
                formik.errors.preTriggerProgesterone
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="postTriggerLH"
              label="Post trigger - LH"
              fullWidth
              value={formik.values.postTriggerLH}
              onChange={formik.handleChange}
              error={
                formik.touched.postTriggerLH &&
                Boolean(formik.errors.postTriggerLH)
              }
              helperText={
                formik.touched.postTriggerLH && formik.errors.postTriggerLH
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="postTriggerProgesterone"
              label="Post trigger - Progesterone"
              fullWidth
              value={formik.values.postTriggerProgesterone}
              onChange={formik.handleChange}
              error={
                formik.touched.postTriggerProgesterone &&
                Boolean(formik.errors.postTriggerProgesterone)
              }
              helperText={
                formik.touched.postTriggerProgesterone &&
                formik.errors.postTriggerProgesterone
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="postTriggerBHCG"
              label="Post trigger - b-hCG"
              fullWidth
              value={formik.values.postTriggerBHCG}
              onChange={formik.handleChange}
              error={
                formik.touched.postTriggerBHCG &&
                Boolean(formik.errors.postTriggerBHCG)
              }
              helperText={
                formik.touched.postTriggerBHCG && formik.errors.postTriggerBHCG
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="e2DayOfTrigger"
              label="E2 on the day of trigger"
              fullWidth
              value={formik.values.e2DayOfTrigger}
              onChange={formik.handleChange}
              error={
                formik.touched.e2DayOfTrigger &&
                Boolean(formik.errors.e2DayOfTrigger)
              }
              helperText={
                formik.touched.e2DayOfTrigger && formik.errors.e2DayOfTrigger
              }
            />
          </Grid>
          <Grid item lg={4}>
            <TextField
              name="endometrialThicknessDayOfTrigger"
              label="Endometrial Thickness on the day of trigger (mm)"
              fullWidth
              value={formik.values.endometrialThicknessDayOfTrigger}
              onChange={formik.handleChange}
              error={
                formik.touched.endometrialThicknessDayOfTrigger &&
                Boolean(formik.errors.endometrialThicknessDayOfTrigger)
              }
              helperText={
                formik.touched.endometrialThicknessDayOfTrigger &&
                formik.errors.endometrialThicknessDayOfTrigger
              }
            />
          </Grid>
        </Grid>
      </Grid>

      <Typography variant="h6" color="primary" pt={2}>
        Oocyte Aspiration
      </Typography>
      <Grid container spacing={2}>
        <Grid item lg={4}>
          <CustomDatePicker
            label="OPU Date"
            name="opuDate"
            value={formik.values.opuDate}
            onChange={date => formik.setFieldValue('opuDate', date)}
            error={formik.touched.opuDate && Boolean(formik.errors.opuDate)}
          />
        </Grid>
        <Grid item lg={4}>
          <CustomTimePicker
            label="OPU Time"
            value={formik.values.opuTime}
            onChange={date => formik.setFieldValue('opuTime', date)}
            error={formik.touched.opuTime && Boolean(formik.errors.opuTime)}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="totalDose"
            label="Total Dose"
            fullWidth
            value={formik.values.totalDose}
            onChange={formik.handleChange}
            error={formik.touched.totalDose && Boolean(formik.errors.totalDose)}
            helperText={formik.touched.totalDose && formik.errors.totalDose}
          />
        </Grid>
        <Grid item lg={4}>
          <DoctorPicker
            formState={formik}
            fieldName={`surgeon`}
            label="Surgeon"
            error={formik.touched.surgeon && Boolean(formik.errors.surgeon)}
            helperText={
              formik.touched.surgeon ? formik.errors.surgeon : undefined
            }
          />
        </Grid>
        <Grid item lg={4}>
          <DoctorPicker
            formState={formik}
            fieldName={`anaesthetist`}
            label="Anaesthetist"
            error={
              formik.touched.anaesthetist && Boolean(formik.errors.anaesthetist)
            }
            helperText={
              formik.touched.anaesthetist
                ? formik.errors.anaesthetist
                : undefined
            }
            speciality={DoctorSpeciality.Anaesthetist}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="otherSurgeons"
            label="Other Surgeons"
            fullWidth
            value={formik.values.otherSurgeons}
            onChange={formik.handleChange}
            error={
              formik.touched.otherSurgeons &&
              Boolean(formik.errors.otherSurgeons)
            }
            helperText={
              formik.touched.otherSurgeons && formik.errors.otherSurgeons
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="selfDonor"
            label="Self/Donor"
            fullWidth
            value={formik.values.selfDonor}
            onChange={formik.handleChange}
            error={formik.touched.selfDonor && Boolean(formik.errors.selfDonor)}
            helperText={formik.touched.selfDonor && formik.errors.selfDonor}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="differenceTriggerOPU"
            label="Difference between trigger and OPU"
            fullWidth
            value={formik.values.differenceTriggerOPU}
            onChange={formik.handleChange}
            error={
              formik.touched.differenceTriggerOPU &&
              Boolean(formik.errors.differenceTriggerOPU)
            }
            helperText={
              formik.touched.differenceTriggerOPU &&
              formik.errors.differenceTriggerOPU
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="folliclesAtTrigger"
            label="No. of Follicles at Trigger"
            fullWidth
            value={formik.values.folliclesAtTrigger}
            onChange={formik.handleChange}
            error={
              formik.touched.folliclesAtTrigger &&
              Boolean(formik.errors.folliclesAtTrigger)
            }
            helperText={
              formik.touched.folliclesAtTrigger &&
              formik.errors.folliclesAtTrigger
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="oocytesRetrieved"
            label="No. of Oocytes Retrieved"
            fullWidth
            value={formik.values.oocytesRetrieved}
            onChange={formik.handleChange}
            error={
              formik.touched.oocytesRetrieved &&
              Boolean(formik.errors.oocytesRetrieved)
            }
            helperText={
              formik.touched.oocytesRetrieved && formik.errors.oocytesRetrieved
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="matureOocytes"
            label="Mature Oocytes"
            fullWidth
            value={formik.values.matureOocytes}
            onChange={formik.handleChange}
            error={
              formik.touched.matureOocytes &&
              Boolean(formik.errors.matureOocytes)
            }
            helperText={
              formik.touched.matureOocytes && formik.errors.matureOocytes
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="immatureOocytes"
            label="Immature Oocytes"
            fullWidth
            value={formik.values.immatureOocytes}
            onChange={formik.handleChange}
            error={
              formik.touched.immatureOocytes &&
              Boolean(formik.errors.immatureOocytes)
            }
            helperText={
              formik.touched.immatureOocytes && formik.errors.immatureOocytes
            }
          />
        </Grid>

        {/* Oocyte Quality */}
        <Grid item lg={4}>
          <TextField
            name="oocyteQuality"
            label="Oocyte Quality"
            fullWidth
            value={formik.values.oocyteQuality}
            onChange={formik.handleChange}
            error={
              formik.touched.oocyteQuality &&
              Boolean(formik.errors.oocyteQuality)
            }
            helperText={
              formik.touched.oocyteQuality && formik.errors.oocyteQuality
            }
          />
        </Grid>
        {/* Specific Abnormalities in Oocytes */}
        <Grid item lg={4}>
          <TextField
            name="specificAbnormalities"
            label="Specific Abnormalities in Oocytes"
            fullWidth
            value={formik.values.specificAbnormalities}
            onChange={formik.handleChange}
            error={
              formik.touched.specificAbnormalities &&
              Boolean(formik.errors.specificAbnormalities)
            }
            helperText={
              formik.touched.specificAbnormalities &&
              formik.errors.specificAbnormalities
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            name="Freezing"
            label="Frezzing"
            fullWidth
            value={formik.values.Freezing}
            onChange={formik.handleChange}
            error={formik.touched.Freezing && Boolean(formik.errors.Freezing)}
            helperText={formik.touched.Freezing && formik.errors.Freezing}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
            Upload Report
          </Typography>
          {/* <Grid container spacing={2} marginBottom={2}> */}
          <Grid item xs={12}>
            {patient && (
              <FileUploadButton
                acceptTypes="image/*, application/pdf"
                maxFiles={5}
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
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            label="Description"
            multiline
            minRows={2}
            fullWidth
            value={formik.values.description}
            name="description"
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
      <Box
        display={'flex'}
        justifyContent={'flex-end'}
        alignItems={'center'}
        gap={2}
        mb={2}
        mt={2}
      >
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={
            isLoading ||
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

export default OocyteAspirationReportForm;
