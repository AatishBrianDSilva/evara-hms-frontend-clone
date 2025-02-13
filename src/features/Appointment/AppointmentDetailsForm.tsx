import React from 'react';
import { useFormik } from 'formik';
import { Button, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { format } from 'date-fns';
import { AppointmentValidationSchema } from '../../yup/yup';
import { useToast } from '../../context/ToastContext';
import { useAddAppointmentMutation } from '../../services/appointmentApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { IAppointment } from '../../types/appointment';
import { MuiTelInput } from 'mui-tel-input';
import { useGetPatientsQuery } from '../../services/patientsApi';
import FieldAutocomplete from '../../components/FieldAutoComplete/FieldAutoComplete';
import { useGetAppointmentReasonsQuery } from '../../services/masterDashboardService/local/appointmentReasonApi';
import { useGetAppointmentSourcesQuery } from '../../services/masterDashboardService/local/appointmentSourceApi';

interface AppointmentDetailsFormProps {
  onBack: () => void;
  onNext: () => void;
  appointment?: IAppointment;
}

const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({
  onBack,
  onNext,
  appointment,
}) => {
  const { showPromiseToast } = useToast();

  const { selectedDate, selectedTimeslot, selectedDoctor } = useSelector(
    (state: RootState) => state.appointments,
  );
  const formatedDate = format(new Date(selectedDate), 'MMM do y');

  const {
    data: patientsData,
    isLoading: isPatientsLoading,
    isFetching: isPatientsFetching,
  } = useGetPatientsQuery({
    paginate: false,
  });
  console.log({ patientsData, isPatientsLoading, isPatientsFetching });
  const patients = patientsData?.data?.records || [];
  const patientsLoading = isPatientsLoading || isPatientsFetching;

  // Mutation to add an appointment
  const [addAppointment, { isLoading: isSchedulingAppointment }] =
    useAddAppointmentMutation();

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
      patientId: values?.patientId?.patientId || null,
    };

    const promise = addAppointment(appointmentData).unwrap();

    showPromiseToast(promise, {
      loading: 'Scheduling Appointment',
      success: response =>
        response.message || 'Appointment Scheduled Successfully',
      error: err =>
        `Error: ${err.response?.data?.message || 'Failed to schedule appointment'}`,
    });

    try {
      await promise;
      formik.resetForm();
      onNext();
    } catch (error: any) {
      console.error('Failed to schedule appointment', error);
    }
  };

  // Fetch appointment reasons
  const {
    data: reasonsData,
    isLoading: isReasonsLoading,
    isFetching: isReasonsFetching,
  } = useGetAppointmentReasonsQuery({
    paginate: false,
    filters: { isAdmin: true },
  });
  const reasons = reasonsData?.data || [];
  const reasonsLoading = isReasonsLoading || isReasonsFetching;

  // Fetch appointment sources
  const {
    data: sourcesData,
    isLoading: isSourcesLoading,
    isFetching: isSourcesFetching,
  } = useGetAppointmentSourcesQuery({
    paginate: false,
    filters: { isAdmin: true },
  });

  const sources = sourcesData?.data || [];
  const sourcesLoading = isSourcesLoading || isSourcesFetching;

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
      patientId: null,
    },
    validationSchema: AppointmentValidationSchema, // Pass the validation schema to Formik
    onSubmit: handleSubmit,
  });

  // Your implementation here
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} sm={3} lg={3}>
          <TextField
            label="Doctor"
            fullWidth
            disabled
            value={
              selectedDoctor
                ? `${selectedDoctor?.firstName} ${selectedDoctor?.lastName}`
                : ''
            }
          />
        </Grid>
        <Grid item xs={12} sm={3} lg={3}>
          <TextField label="Date" fullWidth disabled value={formatedDate} />
        </Grid>
        <Grid item xs={12} sm={3} lg={3}>
          <TextField
            label="Time"
            fullWidth
            disabled
            value={selectedTimeslot ? selectedTimeslot : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <FieldAutocomplete
            options={patients}
            getOptionLabel={option => `${option.firstName} ${option.lastName}`}
            getOptionKey={option => option._id}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            label="Patient"
            loading={patientsLoading}
            value={formik.values.patientId}
            onChange={value => {
              if (value) {
                formik.setFieldValue('patientId', value);
                formik.setFieldValue(
                  'fullName',
                  `${value.firstName} ${value.lastName}`,
                );
                formik.setFieldValue('phone', `${value.mobile}`);
                formik.setFieldValue('city', value.city);
              } else {
                formik.setFieldValue('patientId', null);
                formik.setFieldValue('fullName', '');
                formik.setFieldValue('phone', '');
                formik.setFieldValue('city', '');
              }
            }}
            error={formik.touched.patientId && Boolean(formik.errors.patientId)}
            helperText={formik.touched.patientId && formik.errors.patientId}
          />
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
          <MuiTelInput
            label="Phone"
            name="phone"
            value={formik.values.phone}
            onChange={value => {
              const countryCode = value.substring(0, value.indexOf(' '));
              const phoneNumber = value
                .substring(value.indexOf(' ') + 1)
                .replace(/\s/g, '');
              formik.setFieldValue('phone', countryCode + ' ' + phoneNumber);
            }}
            defaultCountry={'IN'}
            fullWidth
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
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
            helperText={formik.touched.reason && formik.errors.reason}
            fullWidth
          >
            {reasonsLoading ? (
              <MenuItem value="">Loading...</MenuItem>
            ) : (
              reasons.map(reason => (
                <MenuItem key={reason.name} value={reason.name}>
                  {reason.name}
                </MenuItem>
              ))
            )}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4} lg={4}>
          <TextField
            select
            name="mode"
            label="Mode"
            value={formik.values.mode}
            onChange={formik.handleChange}
            error={formik.touched.mode && Boolean(formik.errors.mode)}
            helperText={formik.touched.mode && formik.errors.mode}
            fullWidth
          >
            <MenuItem value="In-Person">In-Person</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4} lg={4}>
          <TextField
            select
            name="source"
            label="Source"
            value={formik.values.source}
            onChange={formik.handleChange}
            error={formik.touched.source && Boolean(formik.errors.source)}
            helperText={formik.touched.source && formik.errors.source}
            fullWidth
          >
            {sourcesLoading ? (
              <MenuItem value="">Loading...</MenuItem>
            ) : (
              sources.map(source => (
                <MenuItem key={source.name} value={source.name}>
                  {source.name}
                </MenuItem>
              ))
            )}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={12} lg={12}>
          <TextField
            multiline
            name="notes"
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
        <Button
          size="small"
          disabled={isSchedulingAppointment}
          variant="contained"
          color="primary"
          type="submit"
        >
          Confirm
        </Button>
        <Button
          size="small"
          disabled={isSchedulingAppointment}
          variant="contained"
          color="secondary"
          onClick={onBack}
        >
          Back
        </Button>
      </Stack>
    </form>
  );
};

export default AppointmentDetailsForm;
