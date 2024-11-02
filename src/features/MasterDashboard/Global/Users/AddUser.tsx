import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { useAddGlobalUserMutation } from '../../../../services/masterDashboardService/global/globalUser';
import _ from 'lodash';
import { useToast } from '../../../../context/ToastContext';
import { EUserRole } from '../../../../types/masterDashboard/global';
import { useGetActiveBranchesQuery } from '../../../../services/masterDashboardService/global/globalBranch';
import { CLINICID } from '../../../Auth/Login';
import FieldAutocomplete from '../../../../components/FieldAutoComplete/FieldAutoComplete';

interface AddUserProps {
  openModal: boolean;
  onClose: () => void;
}

interface IFormValues {
  // clinicId: string;
  branchId: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  role: EUserRole | '';
}

const AddUser: React.FC<AddUserProps> = ({ openModal, onClose }) => {
  const { showPromiseToast } = useToast();

  const { data, isLoading, isFetching } = useGetActiveBranchesQuery(CLINICID);
  const branches = data?.data || [];

  const gettingBranches = isLoading || isFetching;

  const [addUser, { isLoading: UserLoading }] = useAddGlobalUserMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    const payload = {
      // clinicId: values.clinicId,
      branchId: values.branchId,
      username: values.username,
      email: values.email,
      password: values.password,
      phone: values.phone,
      role: values.role,
    };

    // console.log("Payload to be submitted:", payload); // Log the payload

    const promise = addUser(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding...',
      success: data => data || 'Added Successfully',
      error: data => data || 'Adding Failed',
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }

    onClose();
  };

  const initialValues: IFormValues = {
    // clinicId: "",
    username: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    branchId: '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Add Users</DialogTitle>
      <DialogContent>
        <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2}>
            {/* <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="clinicId"
                name="clinicId"
                label="Clinic ID"
                value={formik.values.clinicId}
                onChange={formik.handleChange}
              />
            </Grid> */}
            <Grid item xs={8} sm={4} lg={3}>
              <FieldAutocomplete
                fullWidth
                options={branches}
                getOptionLabel={option => (option ? option.branchName : '')}
                isOptionEqualToValue={(option, value) =>
                  option.branchId === value.branchId
                }
                loading={gettingBranches}
                label="Branch"
                value={
                  branches.find(
                    branch => branch.branchId === formik.values.branchId,
                  ) || null
                }
                onChange={value => {
                  formik.setFieldValue('branchId', value?.branchId ?? '', true);
                }}
                error={
                  formik.touched.branchId && Boolean(formik.errors.branchId)
                }
                helperText={formik.touched.branchId && formik.errors.branchId}
              />
            </Grid>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
              />
            </Grid>
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
                id="password"
                name="password"
                label="Password"
                value={formik.values.password}
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
                select
                id="role"
                name="role"
                label="Role"
                value={formik.values.role}
                onChange={formik.handleChange}
              >
                {Object.values(EUserRole).map(role => (
                  <MenuItem key={role} value={role}>
                    {_.kebabCase(role)}
                  </MenuItem>
                ))}
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
              disabled={_.isEqual(initialValues, formik.values) || UserLoading}
              sx={{ width: 'fit-content' }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: 'fit-content' }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
