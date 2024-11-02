import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Skeleton,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';

import {
  useEditDrugItemMutation,
  useGetDrugItemByIdQuery,
} from '../../../../services/pharmacyDashboardService/master/drugItemApi';
import _ from 'lodash';
import { CryoParametersValidationSchema } from '../../../../yup/masterDashboard';

import {
  IDrugCategory,
  IDrugManufacturer,
  IDrugType,
  ITaxRate,
} from '../../../../types/pharmacyDashboard/master';

interface EditDrugItemProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
  drugCategories: IDrugCategory[];
  drugTypes: IDrugType[];
  drugManufacturers: IDrugManufacturer[];
  taxRates: ITaxRate[];
}

interface IFormValues {
  doctorName: string;
  contactNumber: string;
  city: string;
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

const EditCryoParameters: React.FC<EditDrugItemProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { isFetching, isLoading } = useGetDrugItemByIdQuery(id);

  const loading = isFetching || isLoading;

  const [, { isLoading: editLoading }] = useEditDrugItemMutation();

  const initialValues: IFormValues = {
    doctorName: '',
    contactNumber: '',
    city: '',
    speciality: '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async () => {
      console.log('done');
    },
    validationSchema: CryoParametersValidationSchema,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Edit Referral Doctor</DialogTitle>
      {loading ? (
        skeletonLoader()
      ) : (
        <DialogContent>
          <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={2} mb={2} mt={2}>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  id="doctorName"
                  name="doctorName"
                  label="Doctor Name"
                  value={formik.values.doctorName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.doctorName &&
                    Boolean(formik.errors.doctorName)
                  }
                  helperText={
                    formik.touched.doctorName && formik.errors.doctorName
                  }
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  id="contactNumber"
                  name="contactNumber"
                  label="Contact Number"
                  value={formik.values.contactNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.contactNumber &&
                    Boolean(formik.errors.contactNumber)
                  }
                  helperText={
                    formik.touched.contactNumber && formik.errors.contactNumber
                  }
                />
              </Grid>

              <Grid item lg={4}>
                <TextField
                  fullWidth
                  id="city"
                  name="city"
                  label=" city"
                  value={formik.values.city || ''}
                  onChange={formik.handleChange}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  id="speciality"
                  name="speciality"
                  label="speciality"
                  value={formik.values.speciality || ''}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.speciality &&
                    Boolean(formik.errors.speciality)
                  }
                  helperText={
                    formik.touched.speciality && formik.errors.speciality
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

export default EditCryoParameters;
