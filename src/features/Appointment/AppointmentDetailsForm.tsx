import React from 'react';
import { useFormik } from 'formik';
import { Button, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { format } from 'date-fns';
import { AppointmentValidationSchema } from '../../utils/yup';
import { useToast } from '../../context/ToastContext';
import { useAddAppointmentMutation } from '../../services/appointmentsApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { IAppointment } from '../../types/types';

interface AppointmentDetailsFormProps {
  onBack: () => void;
  onNext: () => void;
  appointment?: IAppointment;
}

const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({ onBack, onNext, appointment }) => {

  const { showPromiseToast } = useToast();

  const { selectedDate, selectedTimeslot, selectedDoctor } = useSelector((state: RootState) => state.appointments);
  const formatedDate = format(new Date(selectedDate), "MMM do y");

  // Mutation to add an appointment
  const [addAppointment, { isLoading: isSchedulingAppointment }] = useAddAppointmentMutation();

  const handleSubmit = async (values: any) => {

    const appointmentData = {
      doctorId: selectedDoctor?._id,
      date: selectedDate,
      time: selectedTimeslot,
      fullName: values.fullName,
      phone: values.phone,
      city: values.city,
      reason: values.reason,
      mode: values.mode,
      source: values.source,
      notes: values.notes,
    }

    const promise = addAppointment(appointmentData).unwrap();

    showPromiseToast(promise, {
      loading: 'Scheduling Appointment',
      success: (response) => response.message || 'Appointment Scheduled Successfully',
      error: (err) => `Error: ${err.response?.data?.message || 'Failed to schedule appointment'}`
    });

    try {
      await promise;
      formik.resetForm();
      onNext()
    } catch (error: any) {
      console.error('Failed to schedule appointment', error);
    }
  };

  // Formik form state and validation
  const formik = useFormik({
    initialValues: appointment || {
      fullName: '',
      phone: '',
      city: '',
      reason: '',
      mode: '',
      source: '',
      notes: '',
    },
    validationSchema: AppointmentValidationSchema, // Pass the validation schema to Formik
    onSubmit: handleSubmit,
  });

  // Your implementation here
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} sm={3} lg={3}>
          <TextField label="Doctor" fullWidth disabled value={selectedDoctor ? `${selectedDoctor?.firstName} ${selectedDoctor?.lastName}` : ""} />
        </Grid>
        <Grid item xs={12} sm={3} lg={3}>
          <TextField label="Date" fullWidth disabled value={formatedDate} />
        </Grid>
        <Grid item xs={12} sm={3} lg={3}>
          <TextField label="Time" fullWidth disabled value={selectedTimeslot ? selectedTimeslot : ""} />
        </Grid>
        <Grid item xs={12} sm={4} lg={4}>
          <TextField
            label="Full Name"
            name="fullName"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4} lg={4}>
          <TextField
            label="Phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4} lg={4}>
          <TextField
            label="City"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            error={formik.touched.city && Boolean(formik.errors.city)}
            helperText={formik.touched.city && formik.errors.city}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4} lg={4}>
          <TextField
            select
            name="reason"
            label="Reason"
            value={formik.values.reason}
            onChange={formik.handleChange}
            error={formik.touched.reason && Boolean(formik.errors.reason)}
            helperText={formik.touched.reason && formik.errors.reason} fullWidth >
            <MenuItem value="Consultation">First-Consultation</MenuItem>
            <MenuItem value="Checkup">Checkup</MenuItem>
            <MenuItem value="Treatment">Treatment</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4} lg={4}>
          <TextField
            select
            name='mode'
            label="Mode"
            value={formik.values.mode}
            onChange={formik.handleChange}
            error={formik.touched.mode && Boolean(formik.errors.mode)}
            helperText={formik.touched.mode && formik.errors.mode}
            fullWidth >
            <MenuItem value="In-Person">In-Person</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4} lg={4}>
          <TextField
            select
            name='source'
            label="Source"
            value={formik.values.source}
            onChange={formik.handleChange}
            error={formik.touched.source && Boolean(formik.errors.source)}
            helperText={formik.touched.source && formik.errors.source}
            fullWidth >
            <MenuItem value="Referral">Referral</MenuItem>
            <MenuItem value="Walk-in">Walk-in</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={12} lg={12}>
          <TextField
            multiline
            name='notes'
            label="Notes"
            fullWidth
            value={formik.values.notes}
            onChange={formik.handleChange}
            error={formik.touched.notes && Boolean(formik.errors.notes)}
            helperText={formik.touched.notes && formik.errors.notes}
          />
        </Grid>
      </Grid>
      <Stack direction="row" spacing={2} mt={2}>
        <Button size='small' disabled={isSchedulingAppointment} variant="contained" color="primary" type='submit'>
          Confirm
        </Button>
        <Button size='small' disabled={isSchedulingAppointment} variant="contained" color="secondary" onClick={onBack}>
          Back
        </Button>
      </Stack>
    </form>
  )
};

export default AppointmentDetailsForm;
