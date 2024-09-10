import React from 'react'
import { Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, Skeleton, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useToast } from '../../../../context/ToastContext'
import { useEditDrugLocationMutation, useGetDrugLocationByIdQuery } from '../../../../services/pharmacyDashboardService/master/drugLocationApi'
import _ from 'lodash'
import { AddDrugLocationValidationSchema } from '../../../../yup/pharmacyDashboard'

interface EditDrugLocationProps {
  openModal: boolean
  onClose: () => void,
  id: string
}

interface IFormValues {
  location: number | string;
  notes?: string;
  main: boolean;
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
        <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2} >
          <Skeleton variant="rectangular" width={90} height={36} />
          <Skeleton variant="rectangular" width={90} height={36} />
        </Box>
      </Box>
    </DialogContent>
  )
}

const EditDrugLocation: React.FC<EditDrugLocationProps> = ({ openModal, onClose, id }) => {

  const { showPromiseToast } = useToast();

  const { data, isFetching, isLoading } = useGetDrugLocationByIdQuery(id);
  const location = data?.data;
  const loading = isFetching || isLoading;

  const [editDrugLocation, { isLoading: editLoading }] = useEditDrugLocationMutation();
  const handleFormSubmit = async (values: IFormValues) => {

    const payload = {
      id,
      location: values.location,
      notes: values.notes,
      main: values.main
    }

    const promise = editDrugLocation(payload).unwrap()

    showPromiseToast(
      promise,
      {
        loading: 'Editing Drug Location...',
        success: (data) => data || 'Drug Location Edited Successfully',
        error: (data) => data || 'Failed to Edit Drug Location'
      }
    )

    try {
      await promise;
    } catch (error) {
      console.log(error)
    }

    onClose();
  }

  const initialValues: IFormValues = {
    location: location?.location || '',
    notes: location?.notes || '',
    main: location?.main || false
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: AddDrugLocationValidationSchema,
    enableReinitialize: true
  })

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Edit Drug Location</DialogTitle>
      {loading ? skeletonLoader() : (<DialogContent>
        <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2}>
            <Grid item lg={4}>
              <TextField
                fullWidth
                name='location'
                label="Tax Rate"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>
            <Grid item lg={4}>
              <TextField
                fullWidth
                name='notes'
                label="Notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </Grid>
            <Grid item lg={4}>
              <FormControlLabel
                label="Primary Location ?"
                control={
                  <Checkbox
                    name="main"
                    value={formik.values.main}
                    checked={formik.values.main}
                    onChange={formik.handleChange}
                  />
                }
              />
            </Grid>
          </Grid>
          <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2} >
            <Button variant='contained' color='primary' type='submit' disabled={editLoading || _.isEqual(initialValues, formik.values)} sx={{ width: 'fit-content' }}>
              Save
            </Button>
            <Button variant='contained' color='secondary' sx={{ width: 'fit-content' }} onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>)}
    </Dialog>
  )
}

export default EditDrugLocation
