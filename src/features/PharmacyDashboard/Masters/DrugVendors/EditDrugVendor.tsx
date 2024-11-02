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
  Skeleton,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { useToast } from '../../../../context/ToastContext';
import {
  useEditDrugVendorMutation,
  useGetDrugVendorByIdQuery,
} from '../../../../services/pharmacyDashboardService/master/drugVendorApi';
import _ from 'lodash';
import { AddDrugVendorValidationSchema } from '../../../../yup/pharmacyDashboard';

interface EditDrugVendorProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  name: string;
  gst: string;
  pan: string;
  tin: string;
  dl: string;
  contact: {
    person: string;
    phone: string;
    email: string;
  };
  address: {
    addressLine1: string;
    addressLine2: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
  };
  remarks: string;
  status: boolean;
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

const EditDrugVendor: React.FC<EditDrugVendorProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  const { data, isFetching, isLoading } = useGetDrugVendorByIdQuery(id);
  const vendor = data?.data;
  const loading = isFetching || isLoading;

  const [editDrugVendor, { isLoading: editLoading }] =
    useEditDrugVendorMutation();
  const handleFormSubmit = async (values: IFormValues) => {
    const payload = {
      id: id,
      name: values.name,
      gst: values.gst,
      pan: values.pan,
      tin: values.tin,
      dl: values.dl,
      contact: {
        person: values.contact.person,
        phone: values.contact.phone,
        email: values.contact.email,
      },
      address: {
        addressLine1: values.address.addressLine1,
        addressLine2: values.address.addressLine2,
        pincode: values.address.pincode,
        city: values.address.city,
        state: values.address.state,
        country: values.address.country,
      },
      remarks: values.remarks,
      status: values.status ? 'Active' : 'Inactive',
    };

    const promise = editDrugVendor(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Editing Drug Vendor...',
      success: data => data || 'Drug Vendor Edited Successfully',
      error: data => data || 'Failed to Edit Drug Vendor',
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }

    onClose();
  };

  const vendorStatus = vendor?.status === 'Active' ? true : false;

  const initialValues: IFormValues = {
    name: vendor?.name || '',
    gst: vendor?.gst || '',
    pan: vendor?.pan || '',
    tin: vendor?.tin || '',
    dl: vendor?.dl || '',
    contact: {
      person: vendor?.contact?.person || '',
      phone: vendor?.contact?.phone || '',
      email: vendor?.contact?.email || '',
    },
    address: {
      addressLine1: vendor?.address?.addressLine1 || '',
      addressLine2: vendor?.address?.addressLine2 || '',
      pincode: vendor?.address?.pincode || '',
      city: vendor?.address?.city || '',
      state: vendor?.address?.state || '',
      country: vendor?.address?.country || '',
    },
    remarks: vendor?.remarks || '',
    status: vendorStatus,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: AddDrugVendorValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Edit Drug Vendor</DialogTitle>
      {loading ? (
        skeletonLoader()
      ) : (
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
                <TextField
                  fullWidth
                  name="gst"
                  label="GST"
                  value={formik.values.gst}
                  onChange={formik.handleChange}
                  error={formik.touched.gst && Boolean(formik.errors.gst)}
                  helperText={formik.touched.gst && formik.errors.gst}
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
                  name="dl"
                  label="DL"
                  value={formik.values.dl}
                  onChange={formik.handleChange}
                  error={formik.touched.dl && Boolean(formik.errors.dl)}
                  helperText={formik.touched.dl && formik.errors.dl}
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
                    formik.touched.contact?.phone &&
                    formik.errors.contact?.phone
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
                    formik.touched.contact?.email &&
                    formik.errors.contact?.email
                  }
                />
              </Grid>
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
                    formik.touched.address?.state &&
                    formik.errors.address?.state
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
              <Grid item lg={12}>
                <TextField
                  fullWidth
                  multiline
                  name="remarks"
                  label="Remarks"
                  value={formik.values.remarks}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.remarks && Boolean(formik.errors.remarks)
                  }
                  helperText={formik.touched.remarks && formik.errors.remarks}
                />
              </Grid>
              <Grid item lg={12} display={'flex'} justifyContent={'center'}>
                <FormControlLabel
                  label="Active ?"
                  control={
                    <Checkbox
                      name="status"
                      checked={formik.values.status}
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
                disabled={
                  editLoading || _.isEqual(initialValues, formik.values)
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
      )}
    </Dialog>
  );
};

export default EditDrugVendor;
