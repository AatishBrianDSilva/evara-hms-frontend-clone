import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { useFormik } from 'formik';
import { Grid, MenuItem, Typography, IconButton } from '@mui/material';
import * as Yup from 'yup';
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';
import CustomTimePicker from '../../../../components/CustomDatePicker/CustomTimePicker';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import { useEditTreatmentAdviceMutation } from '../../../../services/patientDashboardService/treatmentAdviceApi';
import { useToast } from '../../../../context/ToastContext';

interface EditTreatmentAdviceProps {
  open: boolean;
  onClose: () => void;
  treatmentAdvice: any;
}

const EditTreatmentAdvice: React.FC<EditTreatmentAdviceProps> = ({
  open,
  onClose,
  treatmentAdvice,
}) => {
  const { showPromiseToast } = useToast();
  const [editTreatmentAdvice, { isLoading }] = useEditTreatmentAdviceMutation();
  const [callDetails, setCallDetails] = useState(
    treatmentAdvice?.callDetails || [],
  );

  useEffect(() => {
    if (treatmentAdvice) {
      setCallDetails(treatmentAdvice.callDetails || []);
    }
  }, [treatmentAdvice]);

  const handleCallDetailChange = <K extends keyof (typeof callDetails)[number]>(
    index: number,
    field: K,
    value: (typeof callDetails)[number][K],
  ) => {
    setCallDetails((prevCallDetails: typeof callDetails) =>
      prevCallDetails.map((detail: (typeof callDetails)[number], i: number) =>
        i === index ? { ...detail, [field]: value } : detail,
      ),
    );
  };

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

  const handleSubmit = async (values: any) => {
    const payload = {
      id: treatmentAdvice._id,
      ...values,
      callDetails: callDetails.map(
        (detail: { callDate: Date; callTime: Date; comments: string }) => ({
          ...detail,
          callTime: new Date(detail.callTime).toISOString(),
          callDate: new Date(detail.callDate).toISOString(),
        }),
      ),
    };

    console.log('Payload', payload);

    const promise = editTreatmentAdvice(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Updating Treatment Advice',
      success: response =>
        response.message || 'Treatment advice updated successfully',
      error: err =>
        `Error: ${err.response?.data?.message || 'Failed to update treatment advice'}`,
    });

    try {
      await promise;
      onClose();
    } catch (error) {
      console.error('Error updating treatment advice:', error);
    }
  };

  const validationSchema = Yup.object({
    treatmentAdvice: Yup.string().required('Treatment Advice is required'),
    tentativeDate: Yup.date().required('Tentative Date is required'),
    status: Yup.string().required('Status is required'),
    comments: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      treatmentAdvice: treatmentAdvice.treatmentAdvice || '',
      tentativeDate: new Date(treatmentAdvice.tentativeDate) || new Date(),
      status: treatmentAdvice.status || '',
      comments: treatmentAdvice.comments || '',
    },
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        textAlign="center"
        sx={{ pt: 4 }}
        color="primary"
        variant="h5"
      >
        Edit Treatment Advice
      </DialogTitle>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
          <DialogContent
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Treatment Advice"
                  {...formik.getFieldProps('treatmentAdvice')}
                  error={
                    formik.touched.treatmentAdvice &&
                    Boolean(formik.errors.treatmentAdvice)
                  }
                  helperText={
                    formik.touched.treatmentAdvice &&
                    typeof formik.errors.treatmentAdvice === 'string'
                      ? formik.errors.treatmentAdvice
                      : undefined
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <CustomDatePicker
                  label="Tentative Date"
                  minDate={new Date()}
                  format="dd/MM/yyyy"
                  value={formik.values.tentativeDate}
                  onChange={newValue =>
                    formik.setFieldValue('tentativeDate', newValue)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  {...formik.getFieldProps('status')}
                >
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="waiting">Waiting</MenuItem>
                  <MenuItem value="moved out">Moved Out</MenuItem>
                  <MenuItem value="allocated">Allocated</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Call Details</Typography>
                {callDetails.map(
                  (
                    detail: {
                      callDate: Date;
                      callTime: Date;
                      comments: string;
                    },
                    index: number,
                  ) => (
                    <Grid
                      container
                      spacing={2}
                      key={index}
                      alignItems="center"
                      pb={1}
                    >
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
                          onChange={time =>
                            handleCallDetailChange(index, 'callTime', time)
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
                  ),
                )}
              </Grid>
            </Grid>
          </DialogContent>
        </Paper>
        <DialogActions sx={{ pb: 4, justifyContent: 'center' }}>
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

export default EditTreatmentAdvice;
