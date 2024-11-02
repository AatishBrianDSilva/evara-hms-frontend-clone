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
  MenuItem,
  Typography,
  Skeleton,
} from '@mui/material';
import { useFormik } from 'formik';

import { useToast } from '../../../../context/ToastContext';

import {
  useEditMasterPackageMutation,
  useGetMasterPackageByIdQuery,
} from '../../../../services/masterDashboardService/serviceData/masterPackagesApi';

// Define the types for package data
interface PackageItem {
  itemId: string;
  name: string;
}

interface MasterPackageData {
  name: string;
  cost?: number;
  validTill?: Date | null | string;
  gender?: string;
  active: boolean;
  procedures?: PackageItem[];
  investigations?: PackageItem[];
  cryoPreservations?: PackageItem[];
  services?: PackageItem[];
  treatmentCycles?: PackageItem[];
}

interface EditMasterPackageProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  packageName: string;
  price: number;
  validTill: Date | null;
  gender: string;
  isActive: boolean;
}

const skeletonLoader = () => (
  <DialogContent>
    <Box p={2}>
      <Grid container spacing={2} mb={2} mt={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Skeleton variant="rectangular" width="100%" height={56} />
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={2} mt={2}>
        <Skeleton variant="rectangular" width="100%" height={32} />
      </Grid>
      <Grid item xs={12} sm={6} lg={4} mb={2} mt={4}>
        <Skeleton variant="rectangular" width="100%" height={32} />
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

const EditMasterPackage: React.FC<EditMasterPackageProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  // Fetch the existing package details
  const { data: masterPackageData, isLoading: isPackageLoading } =
    useGetMasterPackageByIdQuery(id);
  const packageData: MasterPackageData | undefined = masterPackageData?.data;

  const [updatePackage, { isLoading }] = useEditMasterPackageMutation();

  const initialValues: IFormValues = {
    packageName: packageData?.name || '',
    price: packageData?.cost || 0,
    validTill: packageData?.validTill ? new Date(packageData.validTill) : null,
    gender: packageData?.gender || '',
    isActive: packageData?.active || false,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values: IFormValues) => {
      const payload = {
        id,
        isActive: values.isActive,
        procedures:
          packageData?.procedures?.map(item => ({ id: item.itemId })) || [],
        investigations:
          packageData?.investigations?.map(item => ({ id: item.itemId })) || [],
        cryoPreservations:
          packageData?.cryoPreservations?.map(item => ({ id: item.itemId })) ||
          [],
        services:
          packageData?.services?.map(item => ({ id: item.itemId })) || [],
        treatmentCycles:
          packageData?.treatmentCycles?.map(item => ({ id: item.itemId })) ||
          [],
      };

      const promise = updatePackage(payload).unwrap();

      showPromiseToast(promise, {
        loading: 'Updating...',
        success: data => data || 'Updated Successfully',
        error: data => data || 'Update Failed',
      });

      try {
        await promise;
      } catch (error) {
        console.log(error);
      }

      onClose();
    },
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Edit Master Package</DialogTitle>
      {isPackageLoading ? (
        skeletonLoader()
      ) : (
        <DialogContent>
          <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
            {/* Package details */}
            <Grid container spacing={2} mb={2} mt={2} alignItems="center">
              <Grid item xs={12} sm={6} lg={3}>
                <TextField
                  fullWidth
                  id="packageName"
                  name="packageName"
                  label="Package Name"
                  value={formik.values.packageName}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <TextField
                  fullWidth
                  id="price"
                  name="price"
                  label="Price"
                  value={formik.values.price}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <TextField
                  fullWidth
                  id="gender"
                  name="gender"
                  label="Gender"
                  select
                  value={formik.values.gender}
                  disabled
                >
                  <MenuItem value={'male'}>Male</MenuItem>
                  <MenuItem value={'female'}>Female</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {/* Display selected items */}
            <Grid container spacing={2} mb={2} mt={2}>
              {packageData?.treatmentCycles &&
                packageData.treatmentCycles.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6">Treatment Cycles:</Typography>
                    {packageData.treatmentCycles.map(cycle => (
                      <Typography key={cycle.itemId}>{cycle.name}</Typography>
                    ))}
                  </Grid>
                )}

              {packageData?.procedures && packageData.procedures.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6">Procedures:</Typography>
                  {packageData.procedures.map(procedure => (
                    <Typography key={procedure.itemId}>
                      {procedure.name}
                    </Typography>
                  ))}
                </Grid>
              )}

              {packageData?.investigations &&
                packageData.investigations.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6">Investigations:</Typography>
                    {packageData.investigations.map(investigation => (
                      <Typography key={investigation.itemId}>
                        {investigation.name}
                      </Typography>
                    ))}
                  </Grid>
                )}

              {packageData?.cryoPreservations &&
                packageData.cryoPreservations.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6">Cryo Preservations:</Typography>
                    {packageData.cryoPreservations.map(cryo => (
                      <Typography key={cryo.itemId}>{cryo.name}</Typography>
                    ))}
                  </Grid>
                )}

              {packageData?.services && packageData.services.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6">Services:</Typography>
                  {packageData.services.map(service => (
                    <Typography key={service.itemId}>{service.name}</Typography>
                  ))}
                </Grid>
              )}
            </Grid>

            {/* Is Active checkbox */}
            <Grid item xs={12} sm={6} lg={4} mb={2} mt={4}>
              <FormControlLabel
                label="Is Active?"
                control={
                  <Checkbox
                    name="isActive"
                    checked={formik.values.isActive}
                    onChange={formik.handleChange}
                  />
                }
              />
            </Grid>

            {/* Save and Cancel buttons */}
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
                disabled={isLoading || isPackageLoading}
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

export default EditMasterPackage;
