import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { useToast } from '../../../../context/ToastContext';
import { useAddTaxBracketMutation } from '../../../../services/pharmacyDashboardService/master/taxBracketApi';
import _ from 'lodash';
import { AddTaxBracketValidationSchema } from '../../../../yup/pharmacyDashboard';

interface AddTaxBracketProps {
  openModal: boolean;
  onClose: () => void;
}

interface IFormValues {
  taxRate: number | string;
  notes?: string;
}

const AddTaxBracket: React.FC<AddTaxBracketProps> = ({
  openModal,
  onClose,
}) => {
  const { showPromiseToast } = useToast();

  const [addTaxBracket, { isLoading }] = useAddTaxBracketMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    const payload = {
      taxRate: values.taxRate,
      notes: values.notes,
    };

    const promise = addTaxBracket(payload).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding Tax Bracket...',
      success: data => {
        console.log('data', data);
        return 'Tax Bracket Added Successfully';
      },
      error: data => data.message || 'Failed to add Tax Bracket',
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }

    onClose();
  };

  const initialValues: IFormValues = {
    taxRate: '',
    notes: '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: AddTaxBracketValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Add Tax Bracket</DialogTitle>
      <DialogContent>
        <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2}>
            <Grid item lg={4}>
              <TextField
                fullWidth
                name="taxRate"
                label="Tax Rate"
                value={formik.values.taxRate}
                onChange={formik.handleChange}
                error={formik.touched.taxRate && Boolean(formik.errors.taxRate)}
                helperText={formik.touched.taxRate && formik.errors.taxRate}
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

export default AddTaxBracket;
