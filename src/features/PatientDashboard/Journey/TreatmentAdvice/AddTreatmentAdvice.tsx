import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { useFormik } from 'formik';
import { Grid, IconButton, Typography } from '@mui/material';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import * as Yup from 'yup';
import { RootState } from '../../../../app/store';
import { useSelector } from 'react-redux';
import { useAddTreatmentAdviceMutation } from '../../../../services/patientDashboardService/treatmentAdviceApi';
import { useToast } from '../../../../context/ToastContext';
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';
import CustomTimePicker from '../../../../components/CustomDatePicker/CustomTimePicker';

interface AddTreatmentAdviceProps {
  open?: boolean;
  onClose?: () => void;
}

interface CallDetail {
  callDate: Date;
  callTime: Date;
  comments: string;
}

const AddTreatmentAdvice: React.FC<AddTreatmentAdviceProps> = ({
  open,
  onClose,
}) => {
  const { patient, case: patientCase } = useSelector(
    (state: RootState) => state.patients,
  );
  const { showPromiseToast } = useToast();

  const [addPatientTreatmentAdvice, { isLoading }] =
    useAddTreatmentAdviceMutation();

  const [callDetails, setCallDetails] = useState([
    { callDate: new Date(), callTime: new Date(), comments: '' },
  ]);

  const handleAddCallDetail = () => {
    setCallDetails([
      ...callDetails,
      { callDate: new Date(), callTime: new Date(), comments: '' },
    ]);
  };

  const handleDeleteCallDetail = (index: number) => {
    if (callDetails.length > 1) {
      const newCallDetails = [...callDetails];
      newCallDetails.splice(index, 1);
      setCallDetails(newCallDetails);
    }
  };

  // const handleCallDetailChange = (index: number, field: string, value: any) => {
  //   const newCallDetails = [...callDetails];
  //   newCallDetails[index][field] = value;
  //   setCallDetails(newCallDetails);
  // };

  const handleCallDetailChange = <K extends keyof CallDetail>(
    index: number,
    field: K,
    value: CallDetail[K] | null,
  ) => {
    const newCallDetails = [...callDetails];
    if (value !== null) {
      // Only update if value is not null
      newCallDetails[index][field] = value;
      setCallDetails(newCallDetails);
    }
  };

  const handleSubmit = async (values: any) => {
    if (patientCase && patient) {
      const payload = {
        caseId: patientCase.caseId,
        patientCode: patient.patientId,
        patient: patient._id,
        treatmentAdvice: values.treatmentAdvice,
        tentativeDate: values.tentativeDate.toISOString(),
        status: values.status,
        comments: values.comments,
        callDetails: callDetails.map(detail => ({
          ...detail,
          callTime: detail.callTime.toISOString(),
          callDate: detail.callDate.toISOString(), // Convert callDate to string
        })),
      };

      const promise = addPatientTreatmentAdvice(payload).unwrap();

      showPromiseToast(promise, {
        loading: 'Adding Treatment Advice',
        success: response =>
          response.message || 'Treatment advice added successfully',
        error: err =>
          `Error: ${err.response?.data?.message || 'Failed to add treatment advice'}`,
      });

      try {
        await promise;
        createForm.resetForm();
        onClose && onClose();
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  const validationSchema = Yup.object({
    treatmentAdvice: Yup.string().required('Treatment Advice is required'),
    tentativeDate: Yup.date().required('Tentative Date is required'),
    status: Yup.string().required('Status is required'),
    comments: Yup.string(),
  });

  const createForm = useFormik({
    initialValues: {
      treatmentAdvice: '',
      tentativeDate: new Date(),
      status: '',
      comments: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Dialog
      open={open || false}
      onClose={onClose || (() => {})}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle
        sx={{ textAlign: 'center', pt: 4 }}
        color="primary"
        variant="h5"
      >
        Add Treatment Advice
      </DialogTitle>
      <Box component={'form'} onSubmit={createForm.handleSubmit}>
        <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
          <DialogContent
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: '2rem',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Treatment Advice"
                  {...createForm.getFieldProps('treatmentAdvice')}
                  error={
                    createForm.touched.treatmentAdvice &&
                    Boolean(createForm.errors.treatmentAdvice)
                  }
                  helperText={
                    createForm.touched.treatmentAdvice &&
                    createForm.errors.treatmentAdvice
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <CustomDatePicker
                  label="Tentative Date"
                  minDate={new Date()}
                  format="dd/MM/yyyy"
                  value={createForm.values.tentativeDate}
                  onChange={newValue =>
                    createForm.setFieldValue('tentativeDate', newValue)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Status"
                  {...createForm.getFieldProps('status')}
                  error={
                    createForm.touched.status &&
                    Boolean(createForm.errors.status)
                  }
                  helperText={
                    createForm.touched.status && createForm.errors.status
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Comments"
                  {...createForm.getFieldProps('comments')}
                  error={
                    createForm.touched.comments &&
                    Boolean(createForm.errors.comments)
                  }
                  helperText={
                    createForm.touched.comments && createForm.errors.comments
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Call Details</Typography>
                {callDetails.map((detail, index) => (
                  <Grid container spacing={2} key={index} alignItems="center">
                    <Grid item xs={4}>
                      <CustomDatePicker
                        label="Call Date"
                        value={detail.callDate}
                        onChange={date =>
                          handleCallDetailChange(index, 'callDate', date)
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <CustomTimePicker
                        label="Call Time"
                        value={detail.callTime}
                        onChange={date =>
                          handleCallDetailChange(index, 'callTime', date)
                        }
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Comments"
                        value={detail.comments}
                        onChange={e =>
                          handleCallDetailChange(
                            index,
                            'comments',
                            e.target.value,
                          )
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <IconButton onClick={handleAddCallDetail}>
                        <Add />
                      </IconButton>
                      {callDetails.length > 1 && (
                        <IconButton
                          onClick={() => handleDeleteCallDetail(index)}
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </DialogContent>
        </Paper>
        <DialogActions sx={{ pb: 4, gap: 1, justifyContent: 'center' }}>
          <Button variant="contained" disabled={isLoading} type="submit">
            Save
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddTreatmentAdvice;
