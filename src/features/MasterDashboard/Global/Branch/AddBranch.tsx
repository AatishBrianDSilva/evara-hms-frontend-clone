import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { useAddGlobalBranchMutation } from '../../../../services/masterDashboardService/global/globalBranch';
import _ from 'lodash';
import { useToast } from '../../../../context/ToastContext';
import FieldAutocomplete from '../../../../components/FieldAutoComplete/FieldAutoComplete';

interface AddBranchProps {
  openModal: boolean;
  onClose: () => void;
}

interface IFormValues {
  code: string;
  branchName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  manager: string;
  phone: string;
  email: string;
  isActive: boolean;
}

const AddBranch: React.FC<AddBranchProps> = ({ openModal, onClose }) => {
  const { showPromiseToast } = useToast();

  const [addUser, { isLoading: BranchLoading }] = useAddGlobalBranchMutation();

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep',
    'Delhi',
    'Puducherry',
    'Ladakh',
    'Jammu and Kashmir',
  ];

  const handleFormSubmit = async (values: IFormValues) => {
    const payload = {
      code: values.code,
      branchName: values.branchName,
      address: {
        street: values.street,
        city: values.city,
        state: values.state,
        zip: values.zip,
      },
      manager: values.manager,
      phone: values.phone,
      email: values.email,
      isActive: values.isActive,
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
    code: '',
    branchName: '',

    street: '',
    city: '',
    state: '',
    zip: '',

    manager: '',
    phone: '',
    email: '',
    isActive: false,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Add Branch</DialogTitle>
      <DialogContent>
        <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2}>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="code"
                name="code"
                label="Branch Code"
                placeholder="Branch Code"
                value={formik.values.code}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="branchName"
                name="branchName"
                label="Branch Name"
                placeholder="Branch Name"
                value={formik.values.branchName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="street"
                name="street"
                label="Street"
                placeholder="Street"
                value={formik.values.street}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="city"
                name="city"
                label="City"
                placeholder="City"
                value={formik.values.city}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4} lg={3}>
              <FieldAutocomplete
                label="State"
                options={indianStates}
                isOptionEqualToValue={(option, value) => option === value}
                getOptionLabel={option => option}
                value={formik.values.state}
                onChange={value => {
                  formik.setFieldValue('state', value);
                }}
              />
            </Grid>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="zip"
                name="zip"
                label="Zip"
                placeholder="Zip"
                value={formik.values.zip}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="manager"
                name="manager"
                label="Manager"
                placeholder="manager"
                value={formik.values.manager}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone"
                placeholder="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={8} sm={4} lg={3}>
              <FormControlLabel
                label="Active ?"
                control={
                  <Checkbox
                    name="isActive"
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                  />
                }
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
              disabled={
                _.isEqual(initialValues, formik.values) || BranchLoading
              }
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

export default AddBranch;
