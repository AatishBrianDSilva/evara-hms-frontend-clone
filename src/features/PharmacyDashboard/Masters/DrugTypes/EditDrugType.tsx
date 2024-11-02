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
  useEditDrugTypeMutation,
  useGetDrugTypeByIdQuery,
} from '../../../../services/pharmacyDashboardService/master/drugTypeApi';
import _ from 'lodash';
import { AddDrugTypeValidationSchema } from '../../../../yup/pharmacyDashboard';

interface EditDrugTypeProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  name: string;
  shortcode: string;
  notes?: string;
  status?: boolean;
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

const EditDrugType: React.FC<EditDrugTypeProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  const { data, isFetching, isLoading } = useGetDrugTypeByIdQuery(id);
  const type = data?.data;
  const loading = isFetching || isLoading;

  const [editDrugType, { isLoading: editLoading }] = useEditDrugTypeMutation();
  const handleFormSubmit = async (values: IFormValues) => {
    const payload = {
      id,
      name: values.name,
      shortcode: values.shortcode,
      notes: values.notes,
      status: values.status ? 'Active' : 'Inactive',
    };

    const promise = editDrugType(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Editing Drug Type...',
      success: data => data || 'Drug Type Edited Successfully',
      error: data => data || 'Failed to Edit Drug Type',
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }

    onClose();
  };

  const initialValues: IFormValues = {
    name: type?.name || '',
    shortcode: type?.shortcode || '',
    notes: type?.notes || '',
    status: type?.status === 'Active' ? true : false,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: AddDrugTypeValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Edit Drug Type</DialogTitle>
      {loading ? (
        skeletonLoader()
      ) : (
        <DialogContent>
          <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={2} mb={2} mt={2}>
              <Grid item lg={4}>
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
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  name="shortcode"
                  label="Short Code"
                  value={formik.values.shortcode}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.shortcode && Boolean(formik.errors.shortcode)
                  }
                  helperText={
                    formik.touched.shortcode && formik.errors.shortcode
                  }
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  name="notes"
                  label="Notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  error={formik.touched.notes && Boolean(formik.errors.notes)}
                  helperText={formik.touched.notes && formik.errors.notes}
                />
              </Grid>

              <Grid item lg={12} display={'flex'} justifyContent={'center'}>
                <FormControlLabel
                  label="Active ?"
                  control={
                    <Checkbox
                      name="status"
                      value={formik.values.status}
                      checked={formik.values.status}
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

export default EditDrugType;
