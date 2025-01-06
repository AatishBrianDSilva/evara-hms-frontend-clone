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
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import _ from 'lodash';
import {
  useEditGlobalUserMutation,
  useGetGlobalUserByIdQuery,
} from '../../../../services/masterDashboardService/global/globalUser';
import { useToast } from '../../../../context/ToastContext';
import {
  DoctorSpeciality,
  EUserRole,
} from '../../../../types/masterDashboard/global';
import * as Yup from 'yup';

interface EditUserProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

// Extend your interface to match new fields in the user data
interface IFormValues {
  clinicId: string;
  branchId: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  role: string;

  // Additional "doctor" fields:
  firstName: string;
  lastName: string;
  gender: string;
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

const editValidationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().nullable(),
  role: Yup.string().required('Role is required'),

  firstName: Yup.string().when('role', ([role], schema) => {
    const roleValue = role as unknown as EUserRole;
    if (
      roleValue === EUserRole.Doctor ||
      roleValue === EUserRole.Embryologist
    ) {
      return schema.required('First name is required');
    }
    return schema.nullable();
  }),

  gender: Yup.string().when('role', ([role], schema) => {
    const roleValue = role as unknown as EUserRole;
    if (
      roleValue === EUserRole.Doctor ||
      roleValue === EUserRole.Embryologist
    ) {
      return schema.required('Gender is required');
    }
    return schema.nullable();
  }),

  speciality: Yup.string().when('role', ([role], schema) => {
    const roleValue = role as unknown as EUserRole;
    // Only require speciality if role == 'doctor'
    if (roleValue === EUserRole.Doctor) {
      return schema.required('Speciality is required');
    }
    return schema.nullable();
  }),
});

const EditUser: React.FC<EditUserProps> = ({ openModal, onClose, id }) => {
  const { showPromiseToast } = useToast();

  const {
    data: UserData,
    isLoading: UserLoading,
    isFetching: UserFetching,
  } = useGetGlobalUserByIdQuery(id);

  const [editUserMutation, { isLoading: isEditing }] =
    useEditGlobalUserMutation();

  // The user data from the API
  const user = UserData?.data || null;

  const isUserLoading = UserLoading || UserFetching;

  // Prepare initial values - if your API includes
  // firstName, lastName, gender, speciality in 'user',
  // then set them here
  const initialValues: IFormValues = {
    clinicId: user?.clinicId || '',
    branchId: user?.branchId || '',
    username: user?.username || '',
    email: user?.email || '',
    password: '', // Usually not exposed on edit or set to an empty string
    phone: user?.phone || '',
    role: user?.role || '',

    // If your user data contains these fields:
    firstName: user?.doctor?.firstName || '',
    lastName: user?.doctor?.lastName || '',
    gender: user?.doctor?.gender || '',
    speciality: user?.doctor?.speciality || '',
  };

  // Define the validation schema

  const formik = useFormik<IFormValues>({
    initialValues,
    validationSchema: editValidationSchema,
    enableReinitialize: true,
    onSubmit: async values => {
      try {
        // Build the payload for the edit
        // Only send these fields if user is doctor/embryologist
        // or your backend can accept them no matter what
        let payload: any = {
          userId: id,
          username: values.username,
          email: values.email,
          role: values.role,
          phone: values.phone,
        };

        if (
          values.role === EUserRole.Doctor ||
          values.role === EUserRole.Embryologist
        ) {
          payload.firstName = values.firstName;
          payload.lastName = values.lastName;
          payload.gender = values.gender;
          payload.speciality = values.speciality;
        }

        const promise = editUserMutation(payload).unwrap();

        showPromiseToast(promise, {
          loading: 'Editing User...',
          success: data => data || 'User Edited Successfully',
          error: data => data || 'Failed to Edit User',
        });

        await promise;
        onClose();
      } catch (error) {
        console.error('Edit failed:', error);
      }
    },
  });

  const { values, touched, errors } = formik;

  // Condition to show "doctor" fields
  const shouldShowDoctorFields =
    values.role === EUserRole.Doctor || values.role === EUserRole.Embryologist;

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Edit User</DialogTitle>
      {isUserLoading ? (
        skeletonLoader()
      ) : (
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={2} mb={2} mt={2}>
              {/* Typically clinicId and branchId are read-only */}
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="clinicId"
                  name="clinicId"
                  label="Clinic ID"
                  disabled
                  value={values.clinicId}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="branchId"
                  name="branchId"
                  label="Branch ID"
                  disabled
                  value={values.branchId}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* Username */}
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={values.username}
                  onChange={formik.handleChange}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={values.email}
                  onChange={formik.handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone"
                  value={values.phone}
                  onChange={formik.handleChange}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
              </Grid>

              {/* Role */}
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  select
                  fullWidth
                  id="role"
                  name="role"
                  label="Role"
                  value={values.role}
                  onChange={formik.handleChange}
                  error={touched.role && Boolean(errors.role)}
                  helperText={touched.role && errors.role}
                >
                  {Object.values(EUserRole).map(role => (
                    <MenuItem key={role} value={role}>
                      {_.startCase(_.toLower(role))}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Conditionally render Doctor/Embryologist fields */}
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
                      value={values.firstName}
                      onChange={formik.handleChange}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>

                  {/* Last Name */}
                  <Grid item xs={8} sm={4} lg={3}>
                    <TextField
                      fullWidth
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      value={values.lastName}
                      onChange={formik.handleChange}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
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
                      value={values.gender}
                      onChange={formik.handleChange}
                      error={touched.gender && Boolean(errors.gender)}
                      helperText={touched.gender && errors.gender}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Speciality (only if role = doctor) */}
                  {values.role === EUserRole.Doctor && (
                    <Grid item xs={8} sm={4} lg={3}>
                      <TextField
                        fullWidth
                        select
                        id="speciality"
                        name="speciality"
                        label="Speciality"
                        value={values.speciality}
                        onChange={formik.handleChange}
                        error={touched.speciality && Boolean(errors.speciality)}
                        helperText={touched.speciality && errors.speciality}
                      >
                        {Object.values(DoctorSpeciality).map(speciality => {
                          // Skip embryologist if we only want that shown for EUserRole.Embryologist
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

            {/* Footer Buttons */}
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

export default EditUser;
