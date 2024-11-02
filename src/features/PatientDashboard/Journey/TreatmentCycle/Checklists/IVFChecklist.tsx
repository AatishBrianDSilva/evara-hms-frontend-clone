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
import { useToast } from '../../../../../context/ToastContext';
import _ from 'lodash';
import { IPatientTreatmentCycleChecklist } from '../../../../../types/patientDashboard/treatmentCycle';
import {
  useEditTreatmentCycleMutation,
  useGetTreatmentCyclesQuery,
} from '../../../../../services/patientDashboardService/treatmentCycleApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';

interface IFormValues {
  PatientName: string;
  maleHistorySheetComplete: string;
  FemaleHistorySheetComplete: string;
  MaleHistorySheetComplete1: string;

  Ivficsi: string;
  embryoFreeze: string;
  EmbryologyTimingOfHcg: string;
  MaleHistorySheetComplete: string;
  AnaesthistToBeInformedForAnesthesia: string;
  BloodReport: string;
}

interface IUIChecklistProps {
  checklist: IPatientTreatmentCycleChecklist;
  treatmentCycleId: string;
}

const IVFChecklist: React.FC<IUIChecklistProps> = ({
  checklist,
  treatmentCycleId,
}) => {
  const { closeModal } = useContext(ModalContext);
  const { showPromiseToast } = useToast();

  const [updateChecklist, { isLoading }] = useEditTreatmentCycleMutation();

  const { patient } = useSelector((state: RootState) => state.patients);

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

  // Find the specific checklist by category and ID
  const currentChecklist = currentTreatmentCycle?.checklists.find(
    c => c._id === checklist._id,
  );

  const handleFormSubmit = async (values: IFormValues) => {
    const options = {
      conditions: {
        editType: 'update',
        category: checklist.category,
      },
    };

    const payload = {
      id: treatmentCycleId,
      details: {
        ...values,
      },
      documentId: checklist._id,
    };

    const promise = updateChecklist({ payload, options }).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding Checklist...',
      success: data => data.message || 'Checklist Updated Successfully',
      error: data => data.message || 'Error Updating Checklist',
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues: IFormValues = {
    PatientName: currentChecklist?.details?.PatientName || '',
    maleHistorySheetComplete:
      currentChecklist?.details?.maleHistorySheetComplete || '',
    FemaleHistorySheetComplete:
      currentChecklist?.details?.FemaleHistorySheetComplete || '',
    MaleHistorySheetComplete1:
      currentChecklist?.details?.MaleHistorySheetComplete1 || '',
    Ivficsi: currentChecklist?.details?.Ivficsi || '',
    embryoFreeze: currentChecklist?.details?.embryoFreeze || '',
    EmbryologyTimingOfHcg:
      currentChecklist?.details?.EmbryologyTimingOfHcg || '',
    MaleHistorySheetComplete:
      currentChecklist?.details?.MaleHistorySheetComplete || '',
    AnaesthistToBeInformedForAnesthesia:
      currentChecklist?.details?.AnaesthistToBeInformedForAnesthesia || '',
    BloodReport: currentChecklist?.details?.BloodReport || '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    // validationSchema: IVFChecklistValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
      <Typography variant="button" color="primary">
        Add IVF Checklist
      </Typography>
      <Grid container spacing={2} mb={2} mt={2}>
        <Grid item lg={4}>
          <TextField
            fullWidth
            name="PatientName"
            label="Patient Name"
            onChange={formik.handleChange}
            value={formik.values.PatientName}
            error={
              formik.touched.PatientName && Boolean(formik.errors.PatientName)
            }
            helperText={formik.touched.PatientName && formik.errors.PatientName}
          ></TextField>
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            select
            name="maleHistorySheetComplete"
            label="Male History Sheet Complete"
            value={formik.values.maleHistorySheetComplete}
            onChange={formik.handleChange}
            error={
              formik.touched.maleHistorySheetComplete &&
              Boolean(formik.errors.maleHistorySheetComplete)
            }
            helperText={
              formik.touched.maleHistorySheetComplete &&
              formik.errors.maleHistorySheetComplete
            }
          >
            <MenuItem value={'true'}>Yes</MenuItem>
            <MenuItem value={'false'}>No</MenuItem>
          </TextField>
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            select
            name="FemaleHistorySheetComplete"
            label="Female History Sheet Complete"
            value={formik.values.FemaleHistorySheetComplete}
            onChange={formik.handleChange}
            error={
              formik.touched.FemaleHistorySheetComplete &&
              Boolean(formik.errors.FemaleHistorySheetComplete)
            }
            helperText={
              formik.touched.FemaleHistorySheetComplete &&
              formik.errors.FemaleHistorySheetComplete
            }
          >
            <MenuItem value={'true'}>Yes</MenuItem>
            <MenuItem value={'false'}>No</MenuItem>
          </TextField>
        </Grid>

        <Grid item lg={4}>
          <TextField
            fullWidth
            select
            name="Ivficsi"
            label=" IVF/ICSI"
            value={formik.values.Ivficsi}
            onChange={formik.handleChange}
            error={formik.touched.Ivficsi && Boolean(formik.errors.Ivficsi)}
            helperText={formik.touched.Ivficsi && formik.errors.Ivficsi}
          >
            <MenuItem value={'true'}>Yes</MenuItem>
            <MenuItem value={'false'}>No</MenuItem>
          </TextField>
        </Grid>

        <Grid item lg={4}>
          <TextField
            fullWidth
            select
            name="embryoFreeze"
            label=" Embryo Freezing"
            value={formik.values.embryoFreeze}
            onChange={formik.handleChange}
            error={
              formik.touched.embryoFreeze && Boolean(formik.errors.embryoFreeze)
            }
            helperText={
              formik.touched.embryoFreeze && formik.errors.embryoFreeze
            }
          >
            <MenuItem value={'true'}>Yes</MenuItem>
            <MenuItem value={'false'}>No</MenuItem>
          </TextField>
        </Grid>

        <Grid item lg={4}>
          <TextField
            fullWidth
            select
            name="AnaesthistToBeInformedForAnesthesia"
            label="Anaesthist to be infromed for Anesthesia "
            value={formik.values.AnaesthistToBeInformedForAnesthesia}
            onChange={formik.handleChange}
            error={
              formik.touched.AnaesthistToBeInformedForAnesthesia &&
              Boolean(formik.errors.AnaesthistToBeInformedForAnesthesia)
            }
            helperText={
              formik.touched.AnaesthistToBeInformedForAnesthesia &&
              formik.errors.AnaesthistToBeInformedForAnesthesia
            }
          >
            <MenuItem value={'true'}>Yes</MenuItem>
            <MenuItem value={'false'}>No</MenuItem>
          </TextField>
        </Grid>
        <Grid item lg={4}>
          <TextField
            fullWidth
            select
            name="BloodReport"
            label="Blood Report (Day-2 , Day-6, Day-10)"
            value={formik.values.BloodReport}
            onChange={formik.handleChange}
            error={
              formik.touched.BloodReport && Boolean(formik.errors.BloodReport)
            }
            helperText={formik.touched.BloodReport && formik.errors.BloodReport}
          >
            <MenuItem value={'true'}>Yes</MenuItem>
            <MenuItem value={'false'}>No</MenuItem>
          </TextField>
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
          disabled={isLoading || _.isEqual(initialValues, formik.values)}
          sx={{ width: 'fit-content' }}
        >
          Submit
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

export default IVFChecklist;
