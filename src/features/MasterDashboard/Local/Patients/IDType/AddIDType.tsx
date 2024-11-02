import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import _ from 'lodash';
import { useToast } from '../../../../../context/ToastContext';
import { useAddPatientIdTypeMutation } from '../../../../../services/masterDashboardService/local/patientIdTypeApi';

interface AddIDTypeProps {
  openModal: boolean;
  onClose: () => void;
}
interface IFormValues {
  name: string;
  format: string;
}

const AddIDType: React.FC<AddIDTypeProps> = ({ openModal, onClose }) => {
  const { showPromiseToast } = useToast();

  const [addIDType, { isLoading: IDTypeLoading }] =
    useAddPatientIdTypeMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    const payload = {
      name: values.name,
      format: values.format,
    };

    // console.log("Payload to be submitted:", payload); // Log the payload

    const promise = addIDType(payload).unwrap();

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
    name: '',
    format: '',
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    // validationSchema: validationSchema,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={'primary'}>Add ID Types</DialogTitle>
      <DialogContent>
        <Box component={'form'} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={1} mb={2} mt={2}>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                select
                id="name"
                name="name"
                label="ID type"
                value={formik.values.name}
                onChange={formik.handleChange}
              >
                <MenuItem value="Aadhar Card">Aadhar Card</MenuItem>
                <MenuItem value="Driving License">Driving License</MenuItem>
                <MenuItem value="Voter ID">Voter ID</MenuItem>
                <MenuItem value="PAN Card">PAN Card</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="format"
                name="format"
                label="Format"
                value={formik.values.format}
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
              disabled={
                IDTypeLoading || _.isEqual(initialValues, formik.values)
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
    </Dialog>
  );
};

export default AddIDType;
