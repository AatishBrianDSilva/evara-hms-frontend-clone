import React, { useMemo } from 'react';
import {
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';

import { useFormik } from 'formik';
import {
  useUpdateAppointmentMutation,
  useGetAppointmentByIdQuery,
  useGetUpcomingAppointmentsQuery,
} from '../../services/appointmentApi';
import { useToast } from '../../context/ToastContext';
import { IDoctor } from '../../types/doctor';
import { IAppointment } from '../../types/appointment';
import { getAvailableTimeslots } from '../../utils/appointmentUtilities';
import FieldAutocomplete from '../../components/FieldAutoComplete/FieldAutoComplete';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';
import { useGetAppointmentReasonsQuery } from '../../services/masterDashboardService/local/appointmentReasonApi';
import { useGetAppointmentSourcesQuery } from '../../services/masterDashboardService/local/appointmentSourceApi';

interface EditAppointmentProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
  doctors: IDoctor[];
}

const EditAppointment: React.FC<EditAppointmentProps> = ({
  openModal,
  onClose,
  id,
  doctors,
}) => {
  const { showPromiseToast } = useToast();
  const [updateAppointment, { isLoading: isUpdating }] =
    useUpdateAppointmentMutation();

  const {
    data: appointmentData,
    isLoading: isAppointmentLoading,
    isFetching: isAppointmentFetching,
  } = useGetAppointmentByIdQuery(id);
  const appointment: IAppointment = appointmentData?.data;

  console.log('Appointment Data', appointment);

  const initialTime = useMemo(() => {
    const initialType = appointment?.time?.includes('AM') ? 'AM' : 'PM';
    return {
      timeslot: appointment?.time || '',
      available: true, // Assuming initial selection should show as available
      type: initialType,
    };
  }, [appointment]);

  const handleSubmit = async (values: any) => {
    const payload = {
      id: appointment._id,
      date: values.date,
      time: values.time.timeslot,
      fullName: values.fullName,
      phone: values.phone,
      city: values.city,
      reason: values.reason,
      mode: values.mode,
      source: values.source,
      notes: values.notes,
      doctorId: values.doctorId._id,
    };

    const promise = updateAppointment(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Updating appointment...',
      success: msg => msg || 'Appointment updated successfully',
      error: msg => msg || 'Failed to update appointment',
    });

    try {
      await promise;
      onClose();
      formik.resetForm();
    } catch (error) {
      console.error('Failed to update appointment', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      fullName: appointment?.fullName || '',
      phone: appointment?.phone || '',
      city: appointment?.city || '',
      doctorId: appointment?.doctorId || null,
      date: appointment?.date || null,
      time: initialTime,
      reason: appointment?.reason || '',
      mode: appointment?.mode || '',
      source: appointment?.source || '',
      notes: appointment?.notes || '',
    },
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  const {
    data: upcomingAppointmentsData,
    isLoading: upcomingAppointmentsLoading,
    isFetching: upcomingAppointmentsFetching,
  } = useGetUpcomingAppointmentsQuery(
    {
      filters: {
        doctorId: formik.values.doctorId?._id,
        date: new Date(formik.values.date).toISOString(),
      },
    },
    {
      skip: !formik.values.doctorId || !formik.values.date,
    },
  );
  const upcomingAppointments: IAppointment[] =
    upcomingAppointmentsData?.data || [];

  const loading =
    isAppointmentFetching ||
    upcomingAppointmentsFetching ||
    isAppointmentLoading ||
    upcomingAppointmentsLoading;

  const bookedTimeslots = upcomingAppointments.map(
    appointment => appointment.time,
  );
  const timeSlots = useMemo(() => {
    const { availableAMTimeslots, availablePMTimeslots } =
      getAvailableTimeslots(bookedTimeslots, new Date(formik.values.date));

    // Map AM timeslots and add 'type' property
    const formattedAM = availableAMTimeslots.map(ts => ({
      type: 'AM',
      timeslot: ts.timeslot,
      available: ts.available,
    }));

    // Map PM timeslots and add 'type' property
    const formattedPM = availablePMTimeslots.map(ts => ({
      type: 'PM',
      timeslot: ts.timeslot,
      available: ts.available,
    }));

    // Concatenate the formatted AM and PM arrays
    return [...formattedAM, ...formattedPM];
  }, [bookedTimeslots]);

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

  return (
    <Modal open={openModal} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: '350px',
          overflowY: 'auto',
          borderRadius: 1,
          boxShadow: 5,
          px: 8,
          py: 5,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          Edit Appointment
        </Typography>
        <Box component={'form'} onSubmit={formik.handleSubmit} mt={4}>
          {loading ? (
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              height={'300px'}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <CustomDatePicker
                    label="Date"
                    value={formik.values.date}
                    onChange={newValue => {
                      newValue && formik.setFieldValue('date', newValue);
                      formik.setFieldValue('time', null);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FieldAutocomplete
                    label="Doctor"
                    options={doctors}
                    getOptionLabel={option =>
                      `${option.firstName} ${option.lastName}`
                    }
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    value={formik.values.doctorId}
                    onChange={newValue => {
                      formik.setFieldValue('doctorId', newValue);
                      formik.setFieldValue('time', null);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FieldAutocomplete
                    label="Time"
                    options={timeSlots}
                    groupBy={option => option.type}
                    getOptionLabel={option => option.timeslot}
                    getOptionDisabled={option => !option.available}
                    isOptionEqualToValue={(option, value) =>
                      option.timeslot === value.timeslot &&
                      option.type === value.type
                    }
                    value={formik.values.time}
                    onChange={newValue =>
                      formik.setFieldValue('time', newValue)
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    value={formik.values.fullName}
                    onChange={formik.handleChange('fullName')}
                    error={
                      formik.touched.fullName && Boolean(formik.errors.fullName)
                    }
                    helperText={
                      formik.touched.fullName && formik.errors.fullName
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <MuiTelInput
                    label="Phone"
                    name="phone"
                    value={formik.values.phone}
                    onChange={value => {
                      const countryCode = value.substring(
                        0,
                        value.indexOf(' '),
                      );
                      const phoneNumber = value
                        .substring(value.indexOf(' ') + 1)
                        .replace(/\s/g, '');
                      formik.setFieldValue(
                        'phone',
                        countryCode + ' ' + phoneNumber,
                      );
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
                    error={
                      formik.touched.reason && Boolean(formik.errors.reason)
                    }
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
                    error={
                      formik.touched.source && Boolean(formik.errors.source)
                    }
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
              <Box
                mt={2}
                display={'flex'}
                justifyContent={'flex-end'}
                alignItems={'center'}
              >
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isUpdating || loading}
                >
                  Update Appointment
                </Button>
                <Button
                  onClick={onClose}
                  color="secondary"
                  variant="outlined"
                  sx={{ ml: 2 }}
                >
                  Cancel
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default EditAppointment;
