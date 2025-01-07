import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Skeleton,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import _ from 'lodash';
// import { useGetDoctorByIdQuery, useUpdateDoctorMutation } from "../../../../services/doctorsApi";
import {
  useEditGlobalUserPasswordMutation,
  useGetGlobalUserByIdQuery,
} from '../../../../services/masterDashboardService/global/globalUser';
import { useToast } from '../../../../context/ToastContext';

interface ChangePasswordProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  email: string;
  newPassword: string;
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

const ChangePassword: React.FC<ChangePasswordProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  const {
    data: UserData,
    isLoading: UserLoading,
    isFetching: UserFetching,
  } = useGetGlobalUserByIdQuery(id);

  const data = UserData ? UserData.data : null;

  const isUserLoading = UserLoading || UserFetching;

  const initialValues: IFormValues = {
    email: data?.email || '',
    newPassword: data?.newPassword || '',
  };

  const [editChangePasswordMutation, { isLoading: isEditing }] =
    useEditGlobalUserPasswordMutation();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async values => {
      try {
        const payload = {
          userId: id,
          email: values.email,
          newPassword: values.newPassword,
        };

        const promise = editChangePasswordMutation(payload).unwrap();
        // console.log("Payload", payload);

        showPromiseToast(promise, {
          loading: 'Changing Password...',
          success: data => data || 'Password Changed Successfully',
          error: data => data || 'Failed to Change Password',
        });

        await promise;
        onClose();
      } catch (error) {
        console.error('Changing failed:', error);
      }
    },
    // validationSchema: validationSchema,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Change User Password</DialogTitle>
      {UserLoading ? (
        skeletonLoader()
      ) : (
        <DialogContent>
          <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={1} mb={2} mt={2}>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                />
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
                disabled={isEditing || isUserLoading}
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

export default ChangePassword;
