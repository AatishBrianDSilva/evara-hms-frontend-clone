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
import { useToast } from '../../../../context/ToastContext';
import { useAddDrugManufacturerMutation } from '../../../../services/pharmacyDashboardService/master/drugManufacturerApi';
import _ from 'lodash';
import { AddDrugManufacturerValidationSchema } from '../../../../yup/pharmacyDashboard';
import FieldAutocomplete from '../../../../components/FieldAutoComplete/FieldAutoComplete';
import {
  IDrugCategory,
  ITaxRate,
} from '../../../../types/pharmacyDashboard/master';

interface AddDrugManufacturerProps {
  openModal: boolean;
  onClose: () => void;
  drugCategories: IDrugCategory[];
  taxRates: ITaxRate[];
}

interface IFormValues {
  name: string;
  category: IDrugCategory[] | null;
  taxRate: ITaxRate | null;
  cst: string;
  apgst: string;
  pan: string;
  tin: string;
  contact: {
    person: string;
    phone: string;
    email: string;
    website?: string;
  };
  address: {
    addressLine1: string;
    addressLine2?: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
  };
  status: boolean;
}

const AddDrugManufacturer: React.FC<AddDrugManufacturerProps> = ({
  openModal,
  onClose,
  drugCategories,
  taxRates,
}) => {
  const { showPromiseToast } = useToast();

  const [addDrugManufacturer, { isLoading }] = useAddDrugManufacturerMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    const payload = {
      name: values.name,
      category: values.category?.map(item => item._id),
      taxRate: values.taxRate?._id,
      cst: values.cst,
      apgst: values.apgst,
      pan: values.pan,
      tin: values.tin,
      contact: {
        person: values.contact.person,
        phone: values.contact.phone,
        email: values.contact.email,
        website: values.contact.website,
      },
      address: {
        addressLine1: values.address.addressLine1,
        addressLine2: values.address.addressLine2,
        pincode: values.address.pincode,
        city: values.address.city,
        state: values.address.state,
        country: values.address.country,
      },
      status: values.status ? 'Active' : 'Inactive',
    };

    const promise = addDrugManufacturer(payload).unwrap();

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
    name: '',
    category: null,
    taxRate: null,
    cst: '',
    apgst: '',
    pan: '',
    tin: '',
    contact: {
      person: '',
      phone: '',
      email: '',
      website: '',
    },
    address: {
      addressLine1: '',
      addressLine2: '',
      pincode: '',
      city: '',
      state: '',
      country: '',
    },
    status: true,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: AddDrugManufacturerValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Add Drug Manufacturer</DialogTitle>
      <DialogContent>
        <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2}>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <FieldAutocomplete
                multiple
                options={drugCategories}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                getOptionLabel={option => {
                  return option.name;
                }}
                label="Category"
                value={formik.values.category || []}
                onChange={newValue => {
                  // new value will be an array of objects
                  formik.setFieldValue('category', newValue);
                }}
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
                helperText={formik.touched.category && formik.errors.category}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <FieldAutocomplete
                options={taxRates}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                getOptionLabel={option => option.taxRate.toString()}
                label="Tax Rate"
                value={formik.values.taxRate}
                onChange={newValue => formik.setFieldValue('taxRate', newValue)}
                error={formik.touched.taxRate && Boolean(formik.errors.taxRate)}
                helperText={formik.touched.taxRate && formik.errors.taxRate}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="apgst"
                label="APGST"
                value={formik.values.apgst}
                onChange={formik.handleChange}
                error={formik.touched.apgst && Boolean(formik.errors.apgst)}
                helperText={formik.touched.apgst && formik.errors.apgst}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="pan"
                label="PAN"
                value={formik.values.pan}
                onChange={formik.handleChange}
                error={formik.touched.pan && Boolean(formik.errors.pan)}
                helperText={formik.touched.pan && formik.errors.pan}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="tin"
                label="TIN"
                value={formik.values.tin}
                onChange={formik.handleChange}
                error={formik.touched.tin && Boolean(formik.errors.tin)}
                helperText={formik.touched.tin && formik.errors.tin}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="cst"
                label="CST"
                value={formik.values.cst}
                onChange={formik.handleChange}
                error={formik.touched.cst && Boolean(formik.errors.cst)}
                helperText={formik.touched.cst && formik.errors.cst}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="contact.person"
                label="Contact Person"
                value={formik.values.contact.person}
                onChange={formik.handleChange}
                error={
                  formik.touched.contact?.person &&
                  Boolean(formik.errors.contact?.person)
                }
                helperText={
                  formik.touched.contact?.person &&
                  formik.errors.contact?.person
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="contact.phone"
                label="Phone"
                value={formik.values.contact.phone}
                onChange={formik.handleChange}
                error={
                  formik.touched.contact?.phone &&
                  Boolean(formik.errors.contact?.phone)
                }
                helperText={
                  formik.touched.contact?.phone && formik.errors.contact?.phone
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="contact.email"
                label="Email"
                value={formik.values.contact.email}
                onChange={formik.handleChange}
                error={
                  formik.touched.contact?.email &&
                  Boolean(formik.errors.contact?.email)
                }
                helperText={
                  formik.touched.contact?.email && formik.errors.contact?.email
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="contact.website"
                label="Website"
                value={formik.values.contact.website}
                onChange={formik.handleChange}
                error={
                  formik.touched.contact?.website &&
                  Boolean(formik.errors.contact?.website)
                }
                helperText={
                  formik.touched.contact?.website &&
                  formik.errors.contact?.website
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="address.addressLine1"
                label="Address Line 1"
                value={formik.values.address.addressLine1}
                onChange={formik.handleChange}
                error={
                  formik.touched.address?.addressLine1 &&
                  Boolean(formik.errors.address?.addressLine1)
                }
                helperText={
                  formik.touched.address?.addressLine1 &&
                  formik.errors.address?.addressLine1
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="address.addressLine2"
                label="Address Line 2"
                value={formik.values.address.addressLine2}
                onChange={formik.handleChange}
                error={
                  formik.touched.address?.addressLine2 &&
                  Boolean(formik.errors.address?.addressLine2)
                }
                helperText={
                  formik.touched.address?.addressLine2 &&
                  formik.errors.address?.addressLine2
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="address.pincode"
                label="Pincode"
                value={formik.values.address.pincode}
                onChange={formik.handleChange}
                error={
                  formik.touched.address?.pincode &&
                  Boolean(formik.errors.address?.pincode)
                }
                helperText={
                  formik.touched.address?.pincode &&
                  formik.errors.address?.pincode
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="address.city"
                label="City"
                value={formik.values.address.city}
                onChange={formik.handleChange}
                error={
                  formik.touched.address?.city &&
                  Boolean(formik.errors.address?.city)
                }
                helperText={
                  formik.touched.address?.city && formik.errors.address?.city
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="address.state"
                label="State"
                value={formik.values.address.state}
                onChange={formik.handleChange}
                error={
                  formik.touched.address?.state &&
                  Boolean(formik.errors.address?.state)
                }
                helperText={
                  formik.touched.address?.state && formik.errors.address?.state
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <TextField
                fullWidth
                name="address.country"
                label="Country"
                value={formik.values.address.country}
                onChange={formik.handleChange}
                error={
                  formik.touched.address?.country &&
                  Boolean(formik.errors.address?.country)
                }
                helperText={
                  formik.touched.address?.country &&
                  formik.errors.address?.country
                }
              />
            </Grid>
            <Grid item lg={12}></Grid>
            <Grid item lg={12} display={'flex'} justifyContent={'center'}>
              <FormControlLabel
                label="Active ?"
                control={
                  <Checkbox
                    name="status"
                    value={formik.values.status}
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
              disabled={isLoading || _.isEqual(initialValues, formik.values)}
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

export default AddDrugManufacturer;
