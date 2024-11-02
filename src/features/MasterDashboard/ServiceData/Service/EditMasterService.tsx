import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';

import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';
import { useToast } from '../../../../context/ToastContext';
import {
  useEditMasterServiceMutation,
  useGetMasterServiceByIdQuery,
} from '../../../../services/masterDashboardService/serviceData/masterServicesApi';

interface EditMasterServiceProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  serviceName: string;
  price: number | 0;
  validTill: Date | null;
  isActive: boolean;
}

const EditMasterService: React.FC<EditMasterServiceProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  const {
    data: ServiceData,
    isLoading: ServiceLoading,
    isFetching: ServiceFetching,
  } = useGetMasterServiceByIdQuery(id);

  const data = ServiceData ? ServiceData.data : null;

  const isServiceLoading = ServiceLoading || ServiceFetching;

  console.log('Data at edit Masters', data);

  const initialValues: IFormValues = {
    serviceName: data?.name || '',
    price: data?.cost || 0,
    validTill: data?.validTill ? new Date(data.validTill) : null,
    isActive: data?.active || false,
  };

  const [editServiceMutation, { isLoading: isEditing }] =
    useEditMasterServiceMutation();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async values => {
      try {
        const cost = values.price || 0;

        const total = cost;

        const payload = {
          id: data?._id,
          name: values.serviceName,
          cost: cost,
          active: values.isActive,
          total: total,
          validTill: values.validTill,
        };

        const promise = editServiceMutation(payload).unwrap();
        console.log('Payload', payload);

        showPromiseToast(promise, {
          loading: 'Editing Service...',
          success: data => data || 'Service Edited Successfully',
          error: data => data || 'Failed to Edit Service',
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
      <DialogTitle color={'primary'}>Edit Service</DialogTitle>
      <DialogContent>
        {isServiceLoading ? (
          <CircularProgress />
        ) : (
          <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={2} mb={2} mt={2}>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  // id="serviceName"
                  name="serviceName"
                  label="Service Name"
                  value={formik.values.serviceName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.serviceName &&
                    Boolean(formik.errors.serviceName)
                  }
                  helperText={
                    formik.touched.serviceName && formik.errors.serviceName
                  }
                />
              </Grid>

              <Grid item lg={4}>
                <TextField
                  fullWidth
                  id="price"
                  name="price"
                  label="Price"
                  // type="number"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>

              <Grid item lg={4}>
                <CustomDatePicker
                  name="validTill"
                  label="Valid Till"
                  value={formik.values.validTill}
                  onChange={value => formik.setFieldValue('validTill', value)}
                />
              </Grid>
              <Grid item lg={4}>
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
                disabled={isEditing || isServiceLoading}
              >
                {isEditing ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="contained" color="secondary" onClick={onClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditMasterService;
