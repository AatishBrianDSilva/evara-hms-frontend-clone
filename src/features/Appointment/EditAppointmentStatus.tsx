import React from 'react';
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

import { useFormik } from 'formik';
import {
  useGetAppointmentByIdQuery,
  useUpdateAppointmentStatusMutation,
} from '../../services/appointmentApi';
import { useToast } from '../../context/ToastContext';
import { IAppointment } from '../../types/appointment';
import CustomTimePicker from '../../components/CustomDatePicker/CustomTimePicker';

interface EditAppointmentProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

const EditAppointmentStatus: React.FC<EditAppointmentProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();
  const [updateAppointment, { isLoading: isUpdating }] =
    useUpdateAppointmentStatusMutation();

  const {
    data: appointmentData,
    isLoading: isAppointmentLoading,
    isFetching: isAppointmentFetching,
  } = useGetAppointmentByIdQuery(id);

  const appointment: IAppointment = appointmentData?.data;

  console.log('Appoinyment Status Data', appointment);

  const isCancelled = appointment?.status === 'Cancelled';

  const handleSubmit = async (values: any) => {
    const payload = {
      id: appointment._id,
      status: values.status,
      reportedTime: values.reportedTime
        ? values.reportedTime.toISOString()
        : null,
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
      status: appointment?.status || '',
      reportedTime: appointment?.reportedTime
        ? new Date(appointment.reportedTime)
        : null,
    },
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  const loading = isAppointmentFetching || isAppointmentLoading;

  return (
    <Modal open={openModal} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          overflowY: 'auto',
          borderRadius: 1,
          boxShadow: 5,
          px: 8,
          py: 5,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          Update Appointment Status
        </Typography>
        <Box component={'form'} onSubmit={formik.handleSubmit} mt={4}>
          {loading ? (
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} lg={6}>
                  <TextField
                    select
                    name="status"
                    label="Status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.status && Boolean(formik.errors.status)
                    }
                    helperText={formik.touched.status && formik.errors.status}
                    fullWidth
                  >
                    {['Scheduled', 'Reported', 'Cancelled', 'Completed'].map(
                      status => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ),
                    )}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomTimePicker
                    disabled={formik.values.status !== 'Reported'} // Enable only when status is "Reported"
                    label="Reported Time"
                    minTime={new Date()}
                    value={formik.values.reportedTime}
                    format="hh:mm a"
                    onChange={newValue => {
                      newValue &&
                        formik.setFieldValue('reportedTime', newValue);
                    }}
                  />
                </Grid>
              </Grid>
              {/* {JSON.stringify(formik.errors)} */}
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
                  disabled={isUpdating || loading || isCancelled}
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

export default EditAppointmentStatus;
