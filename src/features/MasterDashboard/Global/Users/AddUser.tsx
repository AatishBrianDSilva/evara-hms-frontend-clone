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
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAddGlobalUserMutation } from '../../../../services/masterDashboardService/global/globalUser';
import _ from 'lodash';
import { useToast } from '../../../../context/ToastContext';
import {
  DoctorSpeciality,
  EUserRole,
} from '../../../../types/masterDashboard/global';
import { useGetActiveBranchesQuery } from '../../../../services/masterDashboardService/global/globalBranch';
import { CLINICID } from '../../../Auth/Login';
import FieldAutocomplete from '../../../../components/FieldAutoComplete/FieldAutoComplete';

interface AddUserProps {
  openModal: boolean;
  onClose: () => void;
}

// Extend your form interface to include the new fields
interface IFormValues {
  branchId: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  role: EUserRole | '';

  // Additional fields if role = doctor or embryologist
  firstName: string;
  lastName: string;
  gender: string; // e.g. "male" | "female" | "other"
  speciality: string; // e.g. "General", "Embryologist", etc.
}

// Validation schema with conditional requirements
const validationSchema = Yup.object().shape({
  branchId: Yup.string().required('Branch is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
  phone: Yup.string(),
  role: Yup.string().required('Role is required'),

  // Conditionally require these fields if role is doctor or embryologist

  firstName: Yup.string().when('role', ([role], schema) => {
    const roleValue = role as unknown as EUserRole;
    if (
      Object.values([EUserRole.Doctor, EUserRole.Embryologist]).includes(
        roleValue,
      )
    ) {
      return schema.required('First name is required');
    }
    return schema.nullable();
  }),

  gender: Yup.string().when('role', ([role], schema) => {
    const roleValue = role as unknown as EUserRole;
    if (
      Object.values([EUserRole.Doctor, EUserRole.Embryologist]).includes(
        roleValue,
      )
    ) {
      return schema.required('Gender is required');
    }
    return schema.nullable();
  }),

  speciality: Yup.string().when('role', ([role], schema) => {
    const roleValue = role as unknown as EUserRole;
    if (Object.values([EUserRole.Doctor]).includes(roleValue)) {
      return schema.required('Speciality is required');
    }
    return schema.nullable();
  }),
});

const AddUser: React.FC<AddUserProps> = ({ openModal, onClose }) => {
  const { showPromiseToast } = useToast();

  // Fetch branch data
  const { data, isLoading, isFetching } = useGetActiveBranchesQuery(CLINICID);
  const branches = data?.data || [];
  const gettingBranches = isLoading || isFetching;

  // RTK mutation
  const [addUser, { isLoading: UserLoading }] = useAddGlobalUserMutation();

  // Submit Handler
  const handleFormSubmit = async (values: IFormValues) => {
    // Build the payload
    const payload: any = {
      branchId: values.branchId,
      username: values.username,
      email: values.email,
      password: values.password,
      phone: values.phone,
      role: values.role,
    };

    // If role is doctor or embryologist, add the extra fields
    if (
      values.role === EUserRole.Doctor ||
      values.role === EUserRole.Embryologist
    ) {
      payload.firstName = values.firstName;
      payload.lastName = values.lastName;
      payload.gender = values.gender;
      payload.speciality = values.speciality;
    }

    const promise = addUser(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding...',
      success: data => data || 'Added Successfully',
      error: data => data || 'Adding Failed',
    });

    try {
      await promise;
      onClose();
    } catch (error) {
      console.log(error);
      // Not closing the modal if there's an error is optional
      // If you want to keep the modal open, omit onClose() here
    }
  };

  // Initial form values
  const initialValues: IFormValues = {
    branchId: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: '',

    // Additional doctor/embryologist fields
    firstName: '',
    lastName: '',
    gender: '',
    speciality: '',
  };

  // Formik instance
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  // Conditionally show extra fields if user picks Doctor or Embryologist
  const shouldShowDoctorFields =
    formik.values.role === EUserRole.Doctor ||
    formik.values.role === EUserRole.Embryologist;

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Add Users</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2}>
            {/* Branch */}
            <Grid item xs={8} sm={4} lg={3}>
              <FieldAutocomplete
                fullWidth
                options={branches}
                getOptionLabel={(option: any) =>
                  option ? option.branchName : ''
                }
                isOptionEqualToValue={(option: any, value: any) =>
                  option.branchId === value.branchId
                }
                loading={gettingBranches}
                label="Branch"
                value={
                  branches.find(
                    (branch: any) => branch.branchId === formik.values.branchId,
                  ) || null
                }
                onChange={(value: any) => {
                  formik.setFieldValue('branchId', value?.branchId ?? '', true);
                }}
                error={
                  formik.touched.branchId && Boolean(formik.errors.branchId)
                }
                helperText={formik.touched.branchId && formik.errors.branchId}
              />
            </Grid>

            {/* Username */}
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>

            {/* Role */}
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                select
                id="role"
                name="role"
                label="Role"
                value={formik.values.role}
                onChange={formik.handleChange}
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
              >
                {Object.values(EUserRole).map(role => (
                  <MenuItem key={role} value={role}>
                    {_.startCase(_.toLower(role))}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* 
              Conditionally render the additional fields if role is 
              'doctor' or 'embryologist'
            */}
            {shouldShowDoctorFields && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6">Doctor Details</Typography>
                </Grid>
                {/* First Name */}
                <Grid item xs={8} sm={4} lg={3}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.firstName &&
                      Boolean(formik.errors.firstName)
                    }
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                  />
                </Grid>

                {/* Last Name (optional) */}
                <Grid item xs={8} sm={4} lg={3}>
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.lastName && Boolean(formik.errors.lastName)
                    }
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                  />
                </Grid>

                {/* Gender */}
                <Grid item xs={8} sm={4} lg={3}>
                  <TextField
                    fullWidth
                    select
                    id="gender"
                    name="gender"
                    label="Gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.gender && Boolean(formik.errors.gender)
                    }
                    helperText={formik.touched.gender && formik.errors.gender}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Grid>

                {/* Speciality */}
                {formik.values.role === EUserRole.Doctor && (
                  <Grid item xs={8} sm={4} lg={3}>
                    <TextField
                      fullWidth
                      id="speciality"
                      name="speciality"
                      label="Speciality"
                      value={formik.values.speciality}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.speciality &&
                        Boolean(formik.errors.speciality)
                      }
                      helperText={
                        formik.touched.speciality && formik.errors.speciality
                      }
                      select
                    >
                      {Object.values(DoctorSpeciality).map(speciality => {
                        if (speciality === DoctorSpeciality.Embryologist) {
                          return null;
                        }
                        return (
                          <MenuItem key={speciality} value={speciality}>
                            {speciality}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Grid>
                )}
              </>
            )}
          </Grid>

          {/* Buttons */}
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
              // Disable if nothing changed or loading
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
