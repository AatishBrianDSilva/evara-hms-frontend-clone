import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useContext } from 'react';
import ModalContext from '../../../../../context/ModalContext';
import { IPatientTreatmentCycleReport } from '../../../../../types/patientDashboard/treatmentCycle';
import {
  useEditTreatmentCycleMutation,
  useGetTreatmentCyclesQuery,
} from '../../../../../services/patientDashboardService/treatmentCycleApi';
import { useToast } from '../../../../../context/ToastContext';
import _ from 'lodash';
import CustomTimePicker from '../../../../../components/CustomDatePicker/CustomTimePicker';
import CustomDatePicker from '../../../../../components/CustomDatePicker/CustomDatePicker';
import FileUploadButton from '../../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../../types/global';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import FieldAutocomplete from '../../../../../components/FieldAutoComplete/FieldAutoComplete';
import { DoctorSpeciality } from '../../../../../types/masterDashboard/global';
import { useGetDoctorsQuery } from '../../../../../services/doctorsApi';

interface IFormValues {
  volume: string;
  abstinence: string;
  timeOfCollection: Date | null;
  liquefaction: string;
  spermConcentration: string;
  totalEjaculate: string;
  timeOfDispatch: Date | null;
  ph: string;
  rbc: string;
  color: string;
  viscosity: string;
  pusCells: string;
  totalMotiliy: string;
  progression: string;
  nonProgression: string;
  immotile: string;
  morphology: string;
  normalForms: string;
  epithilialCells: string;
  spermPreparationMethod: string;
  volumePrepared: string;
  spermRecovery: string;
  expiryDate: Date | null;
  totalMotileSperm: string;
  nonProgressivePostWash: string;
  immotilePostWash: string;
  totalMotilePostWash: string;
  normalFormsPostWash: string;
  date: Date | null;
  impression: string;
  embryologist1: string;
  embryologist2: string;
  gyneacologist1: string;
  gyneacologist2: string;
  processingMethod: string;
  comments: string;
  description: string;
}

interface IUIHReportProps {
  report: IPatientTreatmentCycleReport;
  treatmentCycleId: string;
}

const IUIHReport: React.FC<IUIHReportProps> = ({
  report,
  treatmentCycleId,
}) => {
  const { closeModal } = useContext(ModalContext);
  const { showPromiseToast } = useToast();

  const patient = useSelector((state: RootState) => state.patients.patient);
  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(['']);

  const [updateReport, { isLoading }] = useEditTreatmentCycleMutation();

  // Fetch doctors for the doctor selection
  const { data: doctorData } = useGetDoctorsQuery({});
  const doctors = doctorData?.data?.records || [];

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

  console.log('Treatment Cycle iuih data', treatmentCyclesData);

  // Find the specific treatment cycle by ID
  const currentTreatmentCycle = patientTreatmentCycles.find(
    cycle => cycle._id === treatmentCycleId,
  );

  // Find the specific report by category and ID
  const currentReport = currentTreatmentCycle?.reports.find(
    r => r._id === report._id,
  );

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
        files: fileUploadedUrl,
      },
      documentId: report._id,
    };

    const promise = updateReport({ payload, options }).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding Report...',
      success: data => data.message || 'Report Updated Successfully',
      error: data => data.message || 'Error Updating Report',
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues: IFormValues = {
    volume: currentReport?.details?.volume || '',
    abstinence: currentReport?.details?.abstinence || '',
    timeOfCollection: currentReport?.details?.timeOfCollection || null,
    liquefaction: currentReport?.details?.liquefaction || '',
    spermConcentration: currentReport?.details?.spermConcentration || '',
    totalEjaculate: currentReport?.details?.totalEjaculate || '',
    timeOfDispatch: currentReport?.details?.timeOfDispatch || null,
    ph: currentReport?.details?.ph || '',
    rbc: currentReport?.details?.rbc || '',
    color: currentReport?.details?.color || '',
    viscosity: currentReport?.details?.viscosity || '',
    pusCells: currentReport?.details?.pusCells || '',
    totalMotiliy: currentReport?.details?.totalMotiliy || '',
    progression: currentReport?.details?.progression || '',
    nonProgression: currentReport?.details?.nonProgression || '',
    immotile: currentReport?.details?.immotile || '',
    morphology: currentReport?.details?.morphology || '',
    normalForms: currentReport?.details?.normalForms || '',
    epithilialCells: currentReport?.details?.epithilialCells || '',
    spermPreparationMethod:
      currentReport?.details?.spermPreparationMethod || '',
    volumePrepared: currentReport?.details?.volumePrepared || '',
    spermRecovery: currentReport?.details?.spermRecovery || '',
    expiryDate: currentReport?.details?.expiryDate || null,
    totalMotileSperm: currentReport?.details?.totalMotileSperm || '',
    nonProgressivePostWash:
      currentReport?.details?.nonProgressivePostWash || '',
    immotilePostWash: currentReport?.details?.immotilePostWash || '',
    totalMotilePostWash: currentReport?.details?.totalMotilePostWash || '',
    normalFormsPostWash: currentReport?.details?.normalFormsPostWash || '',
    date: currentReport?.details?.date || null,
    impression: currentReport?.details?.impression || '',
    embryologist1: currentReport?.details?.embryologist1 || '',
    embryologist2: currentReport?.details?.embryologist2 || '',
    gyneacologist1: currentReport?.details?.gyneacologist1 || '',
    gyneacologist2: currentReport?.details?.gyneacologist2 || '',
    processingMethod: currentReport?.details?.processingMethod || '',
    comments: currentReport?.details?.comments || '',
    description: currentReport?.details?.description || '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    // validationSchema: IUIHReportValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
      <Typography mb={2} variant="button" textAlign={'center'} color="primary">
        IUI-H Report
      </Typography>

      <Typography variant="h6" color="primary" gutterBottom>
        Semen Pre-Process Report
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="volume"
            label="Volume"
            value={formik.values.volume}
            onChange={formik.handleChange}
            error={formik.touched.volume && Boolean(formik.errors.volume)}
            helperText={formik.touched.volume && formik.errors.volume}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="abstinence"
            label="Abstinence"
            value={formik.values.abstinence}
            onChange={formik.handleChange}
            error={
              formik.touched.abstinence && Boolean(formik.errors.abstinence)
            }
            helperText={formik.touched.abstinence && formik.errors.abstinence}
          />
        </Grid>
        <Grid item lg={4}>
          <CustomTimePicker
            fullWidth
            name="timeOfCollection"
            label="Time of Collection"
            value={formik.values.timeOfCollection}
            onChange={date => formik.setFieldValue('timeOfCollection', date)}
            error={
              formik.touched.timeOfCollection &&
              Boolean(formik.errors.timeOfCollection)
            }
            helperText={
              formik.touched.timeOfCollection && formik.errors.timeOfCollection
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="liquefaction"
            label="Liquefaction"
            value={formik.values.liquefaction}
            onChange={formik.handleChange}
            error={
              formik.touched.liquefaction && Boolean(formik.errors.liquefaction)
            }
            helperText={
              formik.touched.liquefaction && formik.errors.liquefaction
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="spermConcentration"
            label="Sperm Concentration"
            value={formik.values.spermConcentration}
            onChange={formik.handleChange}
            error={
              formik.touched.spermConcentration &&
              Boolean(formik.errors.spermConcentration)
            }
            helperText={
              formik.touched.spermConcentration &&
              formik.errors.spermConcentration
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="totalEjaculate"
            label="Total Ejaculate"
            value={formik.values.totalEjaculate}
            onChange={formik.handleChange}
            error={
              formik.touched.totalEjaculate &&
              Boolean(formik.errors.totalEjaculate)
            }
            helperText={
              formik.touched.totalEjaculate && formik.errors.totalEjaculate
            }
          />
        </Grid>
        <Grid item lg={4}>
          <CustomTimePicker
            fullWidth
            name="timeOfDispatch"
            label="Time of Dispatch"
            value={formik.values.timeOfDispatch}
            onChange={date => formik.setFieldValue('timeOfDispatch', date)}
            error={
              formik.touched.timeOfDispatch &&
              Boolean(formik.errors.timeOfDispatch)
            }
            helperText={
              formik.touched.timeOfDispatch && formik.errors.timeOfDispatch
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="ph"
            label="PH"
            value={formik.values.ph}
            onChange={formik.handleChange}
            error={formik.touched.ph && Boolean(formik.errors.ph)}
            helperText={formik.touched.ph && formik.errors.ph}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="rbc"
            label="RBC"
            value={formik.values.rbc}
            onChange={formik.handleChange}
            error={formik.touched.rbc && Boolean(formik.errors.rbc)}
            helperText={formik.touched.rbc && formik.errors.rbc}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="color"
            label="Color"
            value={formik.values.color}
            onChange={formik.handleChange}
            error={formik.touched.color && Boolean(formik.errors.color)}
            helperText={formik.touched.color && formik.errors.color}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="viscosity"
            label="Viscosity"
            value={formik.values.viscosity}
            onChange={formik.handleChange}
            error={formik.touched.viscosity && Boolean(formik.errors.viscosity)}
            helperText={formik.touched.viscosity && formik.errors.viscosity}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="pusCells"
            label="Pus Cells"
            value={formik.values.pusCells}
            onChange={formik.handleChange}
            error={formik.touched.pusCells && Boolean(formik.errors.pusCells)}
            helperText={formik.touched.pusCells && formik.errors.pusCells}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="totalMotiliy"
            label="Total Motility"
            value={formik.values.totalMotiliy}
            onChange={formik.handleChange}
            error={
              formik.touched.totalMotiliy && Boolean(formik.errors.totalMotiliy)
            }
            helperText={
              formik.touched.totalMotiliy && formik.errors.totalMotiliy
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="progression"
            label="Progression"
            value={formik.values.progression}
            onChange={formik.handleChange}
            error={
              formik.touched.progression && Boolean(formik.errors.progression)
            }
            helperText={formik.touched.progression && formik.errors.progression}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="nonProgression"
            label="Non Progression"
            value={formik.values.nonProgression}
            onChange={formik.handleChange}
            error={
              formik.touched.nonProgression &&
              Boolean(formik.errors.nonProgression)
            }
            helperText={
              formik.touched.nonProgression && formik.errors.nonProgression
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="immotile"
            label="Immotile"
            value={formik.values.immotile}
            onChange={formik.handleChange}
            error={formik.touched.immotile && Boolean(formik.errors.immotile)}
            helperText={formik.touched.immotile && formik.errors.immotile}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="morphology"
            label="Morphology"
            value={formik.values.morphology}
            onChange={formik.handleChange}
            error={
              formik.touched.morphology && Boolean(formik.errors.morphology)
            }
            helperText={formik.touched.morphology && formik.errors.morphology}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="normalForms"
            label="Normal Forms"
            value={formik.values.normalForms}
            onChange={formik.handleChange}
            error={
              formik.touched.normalForms && Boolean(formik.errors.normalForms)
            }
            helperText={formik.touched.normalForms && formik.errors.normalForms}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="epithilialCells"
            label="Epithilial Cells"
            value={formik.values.epithilialCells}
            onChange={formik.handleChange}
            error={
              formik.touched.epithilialCells &&
              Boolean(formik.errors.epithilialCells)
            }
            helperText={
              formik.touched.epithilialCells && formik.errors.epithilialCells
            }
          />
        </Grid>
      </Grid>
      <Typography variant="h6" color="primary" gutterBottom>
        Sperm Post-Process Report
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="spermPreparationMethod"
            label="Sperm Preparation Method"
            value={formik.values.spermPreparationMethod}
            onChange={formik.handleChange}
            error={
              formik.touched.spermPreparationMethod &&
              Boolean(formik.errors.spermPreparationMethod)
            }
            helperText={
              formik.touched.spermPreparationMethod &&
              formik.errors.spermPreparationMethod
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="volumePrepared"
            label="Volume Prepared"
            value={formik.values.volumePrepared}
            onChange={formik.handleChange}
            error={
              formik.touched.volumePrepared &&
              Boolean(formik.errors.volumePrepared)
            }
            helperText={
              formik.touched.volumePrepared && formik.errors.volumePrepared
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="spermRecovery"
            label="Sperm Recovery"
            value={formik.values.spermRecovery}
            onChange={formik.handleChange}
            error={
              formik.touched.spermRecovery &&
              Boolean(formik.errors.spermRecovery)
            }
            helperText={
              formik.touched.spermRecovery && formik.errors.spermRecovery
            }
          />
        </Grid>
        <Grid item lg={4}>
          <CustomDatePicker
            fullWidth
            name="expiryDate"
            label="Expiry Date"
            value={formik.values.expiryDate}
            onChange={date => formik.setFieldValue('expiryDate', date)}
            error={
              formik.touched.expiryDate && Boolean(formik.errors.expiryDate)
            }
            helperText={formik.touched.expiryDate && formik.errors.expiryDate}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="totalMotileSperm"
            label="Total Motile Sperm"
            value={formik.values.totalMotileSperm}
            onChange={formik.handleChange}
            error={
              formik.touched.totalMotileSperm &&
              Boolean(formik.errors.totalMotileSperm)
            }
            helperText={
              formik.touched.totalMotileSperm && formik.errors.totalMotileSperm
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="nonProgressivePostWash"
            label="Non Progressive Post Wash"
            value={formik.values.nonProgressivePostWash}
            onChange={formik.handleChange}
            error={
              formik.touched.nonProgressivePostWash &&
              Boolean(formik.errors.nonProgressivePostWash)
            }
            helperText={
              formik.touched.nonProgressivePostWash &&
              formik.errors.nonProgressivePostWash
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="immotilePostWash"
            label="Immotile Post Wash"
            value={formik.values.immotilePostWash}
            onChange={formik.handleChange}
            error={
              formik.touched.immotilePostWash &&
              Boolean(formik.errors.immotilePostWash)
            }
            helperText={
              formik.touched.immotilePostWash && formik.errors.immotilePostWash
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="totalMotilePostWash"
            label="Total Motile Post Wash"
            value={formik.values.totalMotilePostWash}
            onChange={formik.handleChange}
            error={
              formik.touched.totalMotilePostWash &&
              Boolean(formik.errors.totalMotilePostWash)
            }
            helperText={
              formik.touched.totalMotilePostWash &&
              formik.errors.totalMotilePostWash
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="normalFormsPostWash"
            label="Normal Forms Post Wash"
            value={formik.values.normalFormsPostWash}
            onChange={formik.handleChange}
            error={
              formik.touched.normalFormsPostWash &&
              Boolean(formik.errors.normalFormsPostWash)
            }
            helperText={
              formik.touched.normalFormsPostWash &&
              formik.errors.normalFormsPostWash
            }
          />
        </Grid>
        <Grid item lg={4}>
          <CustomDatePicker
            fullWidth
            name="date"
            label="Date"
            value={formik.values.date}
            onChange={date => formik.setFieldValue('date', date)}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="impression"
            label="Impression"
            value={formik.values.impression}
            onChange={formik.handleChange}
            error={
              formik.touched.impression && Boolean(formik.errors.impression)
            }
            helperText={formik.touched.impression && formik.errors.impression}
          />
        </Grid>
        <Grid item lg={4}>
          {/* <TextField
            fullWidth
            name="embryologist1"
            label="Embryologist-1"
            value={formik.values.embryologist1}
            onChange={formik.handleChange}
            error={formik.touched.embryologist1 && Boolean(formik.errors.embryologist1)}
            helperText={formik.touched.embryologist1 && formik.errors.embryologist1}
          /> */}
          <FieldAutocomplete
            options={doctors}
            getOptionLabel={option =>
              `${option.firstName || ''} ${option.lastName || ''}`
            }
            filterOptions={(options, _state) => {
              return options.filter(
                option => option.speciality === DoctorSpeciality.Embryologist,
              );
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={formik.values.embryologist1}
            onChange={newValue => {
              formik.setFieldValue('embryologist1', newValue);
            }}
            label="Embryologist 1"
          />
        </Grid>
        <Grid item lg={4}>
          <FieldAutocomplete
            options={doctors}
            getOptionLabel={option =>
              `${option.firstName || ''} ${option.lastName || ''}`
            }
            filterOptions={(options, _state) => {
              return options.filter(
                option => option.speciality === DoctorSpeciality.Embryologist,
              );
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={formik.values.embryologist2}
            onChange={newValue => {
              formik.setFieldValue('embryologist2', newValue);
            }}
            label="Embryologist 2"
          />
        </Grid>
        <Grid item lg={4}>
          <FieldAutocomplete
            options={doctors}
            getOptionLabel={option =>
              `${option.firstName || ''} ${option.lastName || ''}`
            }
            filterOptions={(options, _state) => {
              return options.filter(
                option => option.speciality === DoctorSpeciality.Gynecologist,
              );
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={formik.values.gyneacologist1}
            onChange={newValue => {
              formik.setFieldValue('gyneacologist1', newValue);
            }}
            label="Gyneacologist 1"
          />
        </Grid>
        <Grid item lg={4}>
          <FieldAutocomplete
            options={doctors}
            getOptionLabel={option =>
              `${option.firstName || ''} ${option.lastName || ''}`
            }
            filterOptions={(options, _state) => {
              return options.filter(
                option => option.speciality === DoctorSpeciality.Gynecologist,
              );
            }}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={formik.values.gyneacologist2}
            onChange={newValue => {
              formik.setFieldValue('gyneacologist2', newValue);
            }}
            label="Gyneacologist 2"
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="processingMethod"
            label="Processing Method"
            value={formik.values.processingMethod}
            onChange={formik.handleChange}
            error={
              formik.touched.processingMethod &&
              Boolean(formik.errors.processingMethod)
            }
            helperText={
              formik.touched.processingMethod && formik.errors.processingMethod
            }
          />
        </Grid>
        <Grid item lg={12}>
          <TextField
            fullWidth
            name="comments"
            label="Comments"
            value={formik.values.comments}
            onChange={formik.handleChange}
            error={formik.touched.comments && Boolean(formik.errors.comments)}
            helperText={formik.touched.comments && formik.errors.comments}
          />
        </Grid>
        <Grid item lg={12}>
          <TextField
            fullWidth
            name="description"
            label="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
          Upload Images & Description
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

export default IUIHReport;
