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
  useAddMasterCryoPreservationMutation,
  useGetMasterDefaultCryoPreservationQuery,
} from '../../../../services/masterDashboardService/serviceData/masterCryoPreservationApi';

interface AddMasterCryoPreservationProps {
  openModal: boolean;
  onClose: () => void;
}

interface IFormValues {
  default: any | null;
  cryoPreservationName: string;
  cryoPreservationId: string;
  price: number;
  validTill: Date | null;
  isActive: boolean;
}

const AddMasterCryoPreservation: React.FC<AddMasterCryoPreservationProps> = ({
  openModal,
  onClose,
}) => {
  const { showPromiseToast } = useToast();

  //fetching default data
  const {
    data: defaultCryoPreservationsData,
    isLoading: isDefaultCryoPreservationsLoading,
    isFetching: isDefaultCryoPreservationFetching,
  } = useGetMasterDefaultCryoPreservationQuery({
    paginate: false,
    filters: { isAdmin: true },
  });

  const defaultCryoPreservations = defaultCryoPreservationsData?.data || [];
  const defaultCryoPreservationsLoading =
    isDefaultCryoPreservationsLoading || isDefaultCryoPreservationFetching;

  const [addCryoPreservation, { isLoading }] =
    useAddMasterCryoPreservationMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    const total = values.price;

    const payload = {
      cryoPreservationType: values.default.cryoPreservationType,
      cryoPreservation: values.default._id,
      name: values.cryoPreservationName,
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
    const promise = addCryoPreservation(payload).unwrap();

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
    cryoPreservationName: '',
    cryoPreservationId: '',
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
      <DialogTitle color={'primary'}>Add Master Cryo-Preservation</DialogTitle>
      <DialogContent>
        <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2} alignItems="center">
            <Grid item xs={12} sm={6} lg={4}>
              <FieldAutocomplete
                label="Master CryoPreservation"
                options={defaultCryoPreservations}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                getOptionLabel={option => option.cryoPreservationName}
                loading={defaultCryoPreservationsLoading}
                value={formik.values.default}
                onChange={value => {
                  formik.setFieldValue('default', value);
                  formik.setFieldValue(
                    'cryoPreservationName',
                    value?.cryoPreservationName || '',
                  );
                  formik.setFieldValue(
                    'cryoPreservationId',
                    value?.cryoPreservationId || '',
                  );
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={6} sm={3} lg={3}>
              <TextField
                fullWidth
                id="cryoPreservationName"
                name="cryoPreservationName"
                label="Cryo-Preservation Name"
                helperText={'Cryo-Preservation name must be unique'}
                value={formik.values.cryoPreservationName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6} sm={3} lg={2}>
              <TextField
                fullWidth
                id="cryoPreservationId"
                name="cryoPreservationId"
                label="Cryo-Preservation ID"
                value={formik.values.cryoPreservationId}
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

export default AddMasterCryoPreservation;
