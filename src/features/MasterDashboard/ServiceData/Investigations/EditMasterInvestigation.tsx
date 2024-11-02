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
import {
  useGetMasterInvestigationByIdQuery,
  useEditMasterInvestigationMutation,
} from '../../../../services/masterDashboardService/serviceData/masterInvestigationApi';
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';
import { useToast } from '../../../../context/ToastContext';

interface EditMasterInvestigationProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  itemName: string;
  price: number | 0;
  validTill: Date | null;
  isActive: boolean;
}

const EditMasterInvestigation: React.FC<EditMasterInvestigationProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  const {
    data: investigationData,
    isLoading: investigationLoading,
    isFetching: investigationFetching,
  } = useGetMasterInvestigationByIdQuery(id);

  const data = investigationData ? investigationData.data : null;

  const isInvestigationLoading = investigationLoading || investigationFetching;

  console.log('Data at edit Masters', data);

  const initialValues: IFormValues = {
    itemName: data?.name || '',
    price: data?.cost || 0,
    validTill: data?.validTill ? new Date(data.validTill) : null,
    isActive: data?.active || false,
  };

  const [editInvestigationMutation, { isLoading: isEditing }] =
    useEditMasterInvestigationMutation();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async values => {
      try {
        const cost = values.price || 0;

        const total = cost;

        const payload = {
          id: data?._id,
          name: values.itemName,
          cost: cost,
          active: values.isActive,
          total: total,
          validTill: values.validTill,
        };

        const promise = editInvestigationMutation(payload).unwrap();
        console.log('Payload', payload);

        showPromiseToast(promise, {
          loading: 'Editing Investigation...',
          success: data => data || 'Investigation Edited Successfully',
          error: data => data || 'Failed to Edit Investigation',
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
      <DialogTitle color={'primary'}>Edit Investigation</DialogTitle>
      <DialogContent>
        {isInvestigationLoading ? (
          <CircularProgress />
        ) : (
          <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={2} mb={2} mt={2}>
              <Grid item lg={12}>
                <TextField
                  fullWidth
                  // id="itemName"
                  disabled
                  name="masterService"
                  label="Master Investigation"
                  value={data?.test.testName}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  // id="itemName"
                  name="itemName"
                  label="Item Name"
                  value={formik.values.itemName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.itemName && Boolean(formik.errors.itemName)
                  }
                  helperText={formik.touched.itemName && formik.errors.itemName}
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
                disabled={isEditing || isInvestigationLoading}
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

export default EditMasterInvestigation;
