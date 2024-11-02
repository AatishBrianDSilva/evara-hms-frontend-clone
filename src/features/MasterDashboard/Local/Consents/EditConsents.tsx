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
import _ from 'lodash';
import {
  useGetConsentByIdQuery,
  useUpdateConsentMutation,
} from '../../../../services/masterDashboardService/local/consentApi';
import { useToast } from '../../../../context/ToastContext';

interface EditConsentProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  name: string;
  purpose: string;
  associatedWith: string;
  file: string;
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

const EditConsent: React.FC<EditConsentProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  const {
    data: ConsentData,
    isLoading: ConsentLoading,
    isFetching: ConsentFetching,
  } = useGetConsentByIdQuery(id);

  // console.log("Id prop", id);

  const data = ConsentData ? ConsentData.data : null;

  const isConsentLoading = ConsentLoading || ConsentFetching;

  // console.log("Data at edit Consents", data);

  const initialValues: IFormValues = {
    name: data?.name || '',
    purpose: data?.purpose || '',
    associatedWith: data?.associatedWith || '',
    file: data?.file || '',
  };

  const [editConsentMutation, { isLoading: isEditing }] =
    useUpdateConsentMutation();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async values => {
      try {
        const payload = {
          id: id,
          name: values.name,
        };

        const promise = editConsentMutation(payload).unwrap();
        // console.log("Payload", payload);

        showPromiseToast(promise, {
          loading: 'Editing Consent...',
          success: data => data || 'Consent Edited Successfully',
          error: data => data || 'Failed to Edit Consent',
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
      <DialogTitle color={'primary'}>Edit Patient Consent</DialogTitle>
      {ConsentLoading ? (
        skeletonLoader()
      ) : (
        <DialogContent>
          <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={1} mb={2} mt={2}>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="purpose"
                  name="purpose"
                  label="Purpose"
                  value={formik.values.purpose}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="associatedWith"
                  name="associatedWith"
                  label="Associated With"
                  value={formik.values.associatedWith}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="file"
                  name="file"
                  label="File"
                  value={formik.values.file}
                  onChange={formik.handleChange}
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
                disabled={isEditing || isConsentLoading}
              >
                {isEditing ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="contained" color="secondary" onClick={onClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default EditConsent;
