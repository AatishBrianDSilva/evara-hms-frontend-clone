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

interface IFormValues {
  hcg: string;
  outcome: string;
}

interface PregnancyOutcomeBetaHCGProps {
  metric: IPatientTreatmentCycleMetric;
  treatmentCycleId: string;
}

const PregnancyOutcomeBetaHCG: React.FC<PregnancyOutcomeBetaHCGProps> = ({
  metric,
  treatmentCycleId,
}) => {
  const { closeModal } = useContext(ModalContext);
  const { showPromiseToast } = useToast();

  const patient = useSelector((state: RootState) => state.patients.patient);

  const [updateMetric, { isLoading }] = useEditTreatmentCycleMutation();

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(['']);

  const { data: cyclesData } = useGetTreatmentCyclesQuery(
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

  // Find the specific treatment cycle by ID
  const currentTreatmentCycle = patientTreatmentCycles.find(
    cycle => cycle._id === treatmentCycleId,
  );

  // Find the specific metric by category and ID
  const currentMetric = currentTreatmentCycle?.metrics.find(
    m => m._id === metric._id,
  );

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

  const initialValues: IFormValues = {
    hcg: currentMetric?.details?.hcg || '',
    outcome: currentMetric?.details?.outcome || '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    // validationSchema: PregnancyOutcomeBetaHCGValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
      <Typography variant="button" color="primary">
        Add {metric.name}
      </Typography>
      <Grid container spacing={2} mb={2} mt={2}>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="hcg"
            label="HCG Value"
            value={formik.values.hcg}
            onChange={formik.handleChange}
            error={formik.touched.hcg && Boolean(formik.errors.hcg)}
            helperText={formik.touched.hcg && formik.errors.hcg}
          />
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            select
            name="outcome"
            label="Outcome"
            value={formik.values.outcome}
            onChange={formik.handleChange}
            error={formik.touched.outcome && Boolean(formik.errors.outcome)}
            helperText={formik.touched.outcome && formik.errors.outcome}
          >
            <MenuItem value={'positive'}>Positive</MenuItem>
            <MenuItem value={'negative'}>Negative</MenuItem>
          </TextField>
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

export default PregnancyOutcomeBetaHCG;
