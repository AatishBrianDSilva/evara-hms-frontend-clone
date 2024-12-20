import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
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
import CustomDatePicker from '../../../../../components/CustomDatePicker/CustomDatePicker';
import CustomTimePicker from '../../../../../components/CustomDatePicker/CustomTimePicker';
import FileUploadButton from '../../../../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets, EDocumentTypes } from '../../../../../types/global';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';

interface IFormValues {
  date: Date | null;
  timeOfThawing: Date | null;
  donorNo: string;
  donorBloodGroup: string;
  semenBankDetails: string;
  volume: string;
  pusCells: string;
  epithilialCells: string;
  appearance: string;
  agglutination: string;
  consultant: string;
  count: string;
  rapidLinearProgression: string;
  nonProgressive: string;
  immotile: string;
  totalMotility: string;
  totalSpermCount: string;
  countPostWash: string;
  rapidLinearProgressionPostWash: string;
  nonProgressivePostWash: string;
  immotilePostWash: string;
  totalMotilityPostWash: string;
  inseminatedVolume: string;
  impression: string;
  remarks: string;
  description: string;
}

interface IUIDReportProps {
  report: IPatientTreatmentCycleReport;
  treatmentCycleId: string;
}

const IUIDReport: React.FC<IUIDReportProps> = ({
  report,
  treatmentCycleId,
}) => {
  const { closeModal } = useContext(ModalContext);
  const { showPromiseToast } = useToast();

  const patient = useSelector((state: RootState) => state.patients.patient);
  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(['']);

  const [updateReport, { isLoading }] = useEditTreatmentCycleMutation();

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

  // console.log("Current Cycle", currentTreatmentCycle);
  // console.log("Current Report", currentReport);

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
    date: currentReport?.details?.date || null,
    timeOfThawing: currentReport?.details?.timeOfThawing || null,
    donorNo: currentReport?.details?.donorNo || '',
    donorBloodGroup: currentReport?.details?.donorBloodGroup || '',
    semenBankDetails: currentReport?.details?.semenBankDetails || '',
    volume: currentReport?.details?.volume || '',
    pusCells: currentReport?.details?.pusCells || '',
    epithilialCells: currentReport?.details?.epithilialCells || '',
    appearance: currentReport?.details?.appearance || '',
    agglutination: currentReport?.details?.agglutination || '',
    consultant: currentReport?.details?.consultant || '',
    count: currentReport?.details?.count || '',
    rapidLinearProgression:
      currentReport?.details?.rapidLinearProgression || '',
    nonProgressive: currentReport?.details?.nonProgressive || '',
    immotile: currentReport?.details?.immotile || '',
    totalMotility: currentReport?.details?.totalMotility || '',
    totalSpermCount: currentReport?.details?.totalSpermCount || '',
    countPostWash: currentReport?.details?.countPostWash || '',
    rapidLinearProgressionPostWash:
      currentReport?.details?.rapidLinearProgressionPostWash || '',
    nonProgressivePostWash:
      currentReport?.details?.nonProgressivePostWash || '',
    immotilePostWash: currentReport?.details?.immotilePostWash || '',
    totalMotilityPostWash: currentReport?.details?.totalMotilityPostWash || '',
    inseminatedVolume: currentReport?.details?.inseminatedVolume || '',
    impression: currentReport?.details?.impression || '',
    remarks: currentReport?.details?.remarks || '',
    description: currentReport?.details?.description || '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    // validationSchema: IUIDReportValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
      <Typography mb={2} variant="button" color="primary">
        IUI-D Report
      </Typography>
      <Typography variant="h6" color="primary" gutterBottom>
        Semen Details
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item lg={4}>
          <CustomDatePicker
            label="Date"
            value={formik.values.date}
            onChange={date => formik.setFieldValue('date', date)}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
          />
        </Grid>
        <Grid item lg={4}>
          <CustomTimePicker
            label="Time of Thawing"
            value={formik.values.timeOfThawing}
            onChange={date => formik.setFieldValue('timeOfThawing', date)}
            error={
              formik.touched.timeOfThawing &&
              Boolean(formik.errors.timeOfThawing)
            }
            helperText={
              formik.touched.timeOfThawing && formik.errors.timeOfThawing
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            select
            name="donorBloodGroup"
            label="Donor Blood Group"
            value={formik.values.donorBloodGroup}
            onChange={formik.handleChange}
            error={
              formik.touched.donorBloodGroup &&
              Boolean(formik.errors.donorBloodGroup)
            }
            helperText={
              formik.touched.donorBloodGroup && formik.errors.donorBloodGroup
            }
          >
            <MenuItem value="A+">A+</MenuItem>
            <MenuItem value="A-">A-</MenuItem>
            <MenuItem value="B+">B+</MenuItem>
            <MenuItem value="B-">B-</MenuItem>
            <MenuItem value="AB+">AB+</MenuItem>
            <MenuItem value="AB-">AB-</MenuItem>
            <MenuItem value="O+">O+</MenuItem>
            <MenuItem value="O-">O-</MenuItem>
          </TextField>
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Donor No"
            name="donorNo"
            value={formik.values.donorNo}
            onChange={formik.handleChange}
            error={formik.touched.donorNo && Boolean(formik.errors.donorNo)}
            helperText={formik.touched.donorNo && formik.errors.donorNo}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Semen Bank Details"
            name="semenBankDetails"
            value={formik.values.semenBankDetails}
            onChange={formik.handleChange}
            error={
              formik.touched.semenBankDetails &&
              Boolean(formik.errors.semenBankDetails)
            }
            helperText={
              formik.touched.semenBankDetails && formik.errors.semenBankDetails
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Volume"
            name="volume"
            value={formik.values.volume}
            onChange={formik.handleChange}
            error={formik.touched.volume && Boolean(formik.errors.volume)}
            helperText={formik.touched.volume && formik.errors.volume}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Pus Cells"
            name="pusCells"
            value={formik.values.pusCells}
            onChange={formik.handleChange}
            error={formik.touched.pusCells && Boolean(formik.errors.pusCells)}
            helperText={formik.touched.pusCells && formik.errors.pusCells}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Epithilial Cells"
            name="epithilialCells"
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
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Appearance"
            name="appearance"
            value={formik.values.appearance}
            onChange={formik.handleChange}
            error={
              formik.touched.appearance && Boolean(formik.errors.appearance)
            }
            helperText={formik.touched.appearance && formik.errors.appearance}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Agglutination"
            name="agglutination"
            value={formik.values.agglutination}
            onChange={formik.handleChange}
            error={
              formik.touched.agglutination &&
              Boolean(formik.errors.agglutination)
            }
            helperText={
              formik.touched.agglutination && formik.errors.agglutination
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Consultant"
            name="consultant"
            value={formik.values.consultant}
            onChange={formik.handleChange}
            error={
              formik.touched.consultant && Boolean(formik.errors.consultant)
            }
            helperText={formik.touched.consultant && formik.errors.consultant}
          />
        </Grid>
      </Grid>
      <Typography variant="h6" color={'primary'} gutterBottom>
        Pre-Wash Details
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Count"
            name="count"
            value={formik.values.count}
            onChange={formik.handleChange}
            error={formik.touched.count && Boolean(formik.errors.count)}
            helperText={formik.touched.count && formik.errors.count}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Rapid Linear Progression"
            name="rapidLinearProgression"
            value={formik.values.rapidLinearProgression}
            onChange={formik.handleChange}
            error={
              formik.touched.rapidLinearProgression &&
              Boolean(formik.errors.rapidLinearProgression)
            }
            helperText={
              formik.touched.rapidLinearProgression &&
              formik.errors.rapidLinearProgression
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Non Progressive"
            name="nonProgressive"
            value={formik.values.nonProgressive}
            onChange={formik.handleChange}
            error={
              formik.touched.nonProgressive &&
              Boolean(formik.errors.nonProgressive)
            }
            helperText={
              formik.touched.nonProgressive && formik.errors.nonProgressive
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Immotile"
            name="immotile"
            value={formik.values.immotile}
            onChange={formik.handleChange}
            error={formik.touched.immotile && Boolean(formik.errors.immotile)}
            helperText={formik.touched.immotile && formik.errors.immotile}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Total Motility"
            name="totalMotility"
            value={formik.values.totalMotility}
            onChange={formik.handleChange}
            error={
              formik.touched.totalMotility &&
              Boolean(formik.errors.totalMotility)
            }
            helperText={
              formik.touched.totalMotility && formik.errors.totalMotility
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Total Sperm Count"
            name="totalSpermCount"
            value={formik.values.totalSpermCount}
            onChange={formik.handleChange}
            error={
              formik.touched.totalSpermCount &&
              Boolean(formik.errors.totalSpermCount)
            }
            helperText={
              formik.touched.totalSpermCount && formik.errors.totalSpermCount
            }
          />
        </Grid>
      </Grid>
      <Typography variant="h6" color={'primary'} gutterBottom>
        Post-Wash Details
      </Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Count"
            name="countPostWash"
            value={formik.values.countPostWash}
            onChange={formik.handleChange}
            error={
              formik.touched.countPostWash &&
              Boolean(formik.errors.countPostWash)
            }
            helperText={
              formik.touched.countPostWash && formik.errors.countPostWash
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Rapid Linear Progression"
            name="rapidLinearProgressionPostWash"
            value={formik.values.rapidLinearProgressionPostWash}
            onChange={formik.handleChange}
            error={
              formik.touched.rapidLinearProgressionPostWash &&
              Boolean(formik.errors.rapidLinearProgressionPostWash)
            }
            helperText={
              formik.touched.rapidLinearProgressionPostWash &&
              formik.errors.rapidLinearProgressionPostWash
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Non Progressive"
            name="nonProgressivePostWash"
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
            label="Immotile"
            name="immotilePostWash"
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
            label="Total Motility"
            name="totalMotilityPostWash"
            value={formik.values.totalMotilityPostWash}
            onChange={formik.handleChange}
            error={
              formik.touched.totalMotilityPostWash &&
              Boolean(formik.errors.totalMotilityPostWash)
            }
            helperText={
              formik.touched.totalMotilityPostWash &&
              formik.errors.totalMotilityPostWash
            }
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            label="Inseminated Volume"
            name="inseminatedVolume"
            value={formik.values.inseminatedVolume}
            onChange={formik.handleChange}
            error={
              formik.touched.inseminatedVolume &&
              Boolean(formik.errors.inseminatedVolume)
            }
            helperText={
              formik.touched.inseminatedVolume &&
              formik.errors.inseminatedVolume
            }
          />
        </Grid>
        <Grid item lg={12}>
          <TextField
            fullWidth
            label="Impression"
            name="impression"
            value={formik.values.impression}
            onChange={formik.handleChange}
            error={
              formik.touched.impression && Boolean(formik.errors.impression)
            }
            helperText={formik.touched.impression && formik.errors.impression}
          />
        </Grid>
        <Grid item lg={12}>
          <TextField
            fullWidth
            label="Remarks"
            name="remarks"
            value={formik.values.remarks}
            onChange={formik.handleChange}
            error={formik.touched.remarks && Boolean(formik.errors.remarks)}
            helperText={formik.touched.remarks && formik.errors.remarks}
          />
        </Grid>
        <Grid item lg={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
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

export default IUIDReport;
