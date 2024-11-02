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
import _ from 'lodash';

import { useToast } from '../../../../context/ToastContext';
import CustomDatePicker from '../../../../components/CustomDatePicker/CustomDatePicker';
import FieldAutocomplete from '../../../../components/FieldAutoComplete/FieldAutoComplete';
import {
  useAddMasterProcedureMutation,
  useGetMasterDefaultProceduresQuery,
} from '../../../../services/masterDashboardService/serviceData/masterProceduresApi';

interface AddMasterProcedureProps {
  openModal: boolean;
  onClose: () => void;
}

interface IFormValues {
  default: any | null;
  procedureName: string;
  procedureId: string;
  price: number;
  validTill: Date | null;
  isActive: boolean;
}

const AddMasterProcedure: React.FC<AddMasterProcedureProps> = ({
  openModal,
  onClose,
}) => {
  const { showPromiseToast } = useToast();

  //fetching default data
  const {
    data: defaultProceduresData,
    isLoading: isDefaultProceduresLoading,
    isFetching: isDefaultProcedureFetching,
  } = useGetMasterDefaultProceduresQuery({
    paginate: false,
    filters: { isAdmin: true },
  });

  const defaultProcedures = defaultProceduresData?.data || [];
  const defaultProceduresLoading =
    isDefaultProceduresLoading || isDefaultProcedureFetching;

  const [addProcedure, { isLoading }] = useAddMasterProcedureMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    const total = values.price;

    const payload = {
      procedureType: values.default.procedureType,
      procedure: values.default._id,
      name: values.procedureName,
      gender: values.default.gender,
      cost: values.price,
      description: values.default.description,
      active: values.isActive,
      total: total,
      validTill: values.validTill,
    };

    console.log('Payload to be submitted:', payload); // Log the payload

    // Add your submission logic here, including tax
    // Extract tax from values
    const promise = addProcedure(payload).unwrap();

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
    default: null,
    procedureName: '',
    procedureId: '',
    price: 0,
    isActive: true,
    validTill: null,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Add Master Procedure</DialogTitle>
      <DialogContent>
        <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2} alignItems="center">
            <Grid item xs={12} sm={6} lg={4}>
              <FieldAutocomplete
                label="Master Procedure"
                options={defaultProcedures}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                getOptionLabel={option => option.procedureName}
                loading={defaultProceduresLoading}
                value={formik.values.default}
                onChange={value => {
                  formik.setFieldValue('default', value);
                  formik.setFieldValue(
                    'procedureName',
                    value?.procedureName || '',
                  );
                  formik.setFieldValue('procedureId', value?.procedureId || '');
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={6} sm={3} lg={3}>
              <TextField
                fullWidth
                id="procedureName"
                name="procedureName"
                label="Procedure Name"
                helperText={'Procedure name must be unique'}
                value={formik.values.procedureName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6} sm={3} lg={2}>
              <TextField
                fullWidth
                id="procedureId"
                name="procedureId"
                label="Procedure ID"
                value={formik.values.procedureId}
                onChange={formik.handleChange}
                disabled
              />
            </Grid>
            <Grid item xs={6} sm={3} lg={3}>
              <TextField
                fullWidth
                id="price"
                name="price"
                label="Price"
                value={formik.values.price}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6} sm={3} lg={3}>
              <CustomDatePicker
                name="validTill"
                label="Valid Till"
                value={formik.values.validTill}
                onChange={value => formik.setFieldValue('validTill', value)}
              />
            </Grid>
            {/* <Grid item xs={6} sm={3} lg={2}>
              <TextField
                fullWidth
                id="tax"
                name="tax"
                label="Tax"
                value={formik.values.tax}
                onChange={formik.handleChange}
              />
            </Grid> */}
            <Grid item xs={6} sm={3} lg={2}>
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
              disabled={_.isEqual(initialValues, formik.values) || isLoading}
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

export default AddMasterProcedure;
