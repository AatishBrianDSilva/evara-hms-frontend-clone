import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Skeleton,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import _ from 'lodash';
import {
  useGetReferralDoctorByIdQuery,
  useUpdateReferralDoctorMutation,
} from '../../../../../services/masterDashboardService/local/referralDoctorApi';
import { useToast } from '../../../../../context/ToastContext';

interface EditDoctorProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  name: string;
  phone: string;
  city: string;
  speciality: string;
}

const skeletonLoader = () => {
  return (
    <DialogContent>
      <Box p={2}>
        <Grid container spacing={2} mb={2} mt={2}>
          <Grid item lg={4}>
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Grid>
          <Grid item lg={4}>
            <Skeleton variant="rectangular" width="100%" height={56} />
          </Grid>
        </Grid>
        <Box
          display={'flex'}
          justifyContent={'flex-end'}
          alignItems={'center'}
          gap={2}
          mb={2}
        >
          <Skeleton variant="rectangular" width={90} height={36} />
          <Skeleton variant="rectangular" width={90} height={36} />
        </Box>
      </Box>
    </DialogContent>
  );
};

const EditLocalReferralDoctor: React.FC<EditDoctorProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  const {
    data: DoctorData,
    isLoading: DoctorLoading,
    isFetching: DoctorFetching,
  } = useGetReferralDoctorByIdQuery(id);

  // console.log("Id prop", id);

  const data = DoctorData ? DoctorData.data : null;

  const isDoctorLoading = DoctorLoading || DoctorFetching;

  // console.log("Data at edit Local Referral Doctor", data);

  const initialValues: IFormValues = {
    name: data?.name || '',
    phone: data?.phone || '',
    city: data?.city || '',
    speciality: data?.speciality || '',
  };

  const [editDoctorMutation, { isLoading: isEditing }] =
    useUpdateReferralDoctorMutation();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async values => {
      try {
        const payload = {
          id: id,
          name: values.name,
          phone: values.phone,
          city: values.city,
          speciality: values.speciality,
          // global: false,
        };

        const promise = editDoctorMutation(payload).unwrap();
        // console.log("Payload", payload);

        showPromiseToast(promise, {
          loading: 'Editing Doctor...',
          success: data => data || 'Doctor Edited Successfully',
          error: data => data || 'Failed to Edit Doctor',
        });

        await promise;
        onClose();
      } catch (error) {
        console.error('Edit failed:', error);
      }
    },
    // validationSchema: validationSchema,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Edit Referral Doctor</DialogTitle>
      {DoctorLoading ? (
        skeletonLoader()
      ) : (
        <DialogContent>
          <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={1} mb={2} mt={2}>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="city"
                  name="city"
                  label="City"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="speciality"
                  name="speciality"
                  select
                  label="Speciality"
                  value={formik.values.speciality}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="Reproductive Endocrinologist">
                    Reproductive Endocrinologist
                  </MenuItem>
                  <MenuItem value="Andrologist">Andrologist</MenuItem>
                  <MenuItem value="Embryologist">Embryologist</MenuItem>
                  <MenuItem value="Urologist">Urologist</MenuItem>
                  <MenuItem value="Reproductive Surgeon">
                    Reproductive Surgeon
                  </MenuItem>
                  <MenuItem value="Gynecologist">Gynecologist</MenuItem>
                  <MenuItem value="Fertility Counselor">
                    Fertility Counselor
                  </MenuItem>
                  <MenuItem value="Genetic Counselor">
                    Genetic Counselor
                  </MenuItem>
                  <MenuItem value="Nurse Practitioner/Registered Nurse">
                    Nurse Practitioner/Registered Nurse
                  </MenuItem>
                  <MenuItem value="Sonographer">Sonographer</MenuItem>
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
                disabled={isEditing || isDoctorLoading}
              >
                {isEditing ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="contained" color="secondary" onClick={onClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default EditLocalReferralDoctor;
