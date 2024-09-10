import React from 'react'
import { Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useToast } from '../../../../context/ToastContext'
import { useAddDrugLocationMutation } from '../../../../services/pharmacyDashboardService/master/drugLocationApi'
import _ from 'lodash'
import { AddDrugLocationValidationSchema } from '../../../../yup/pharmacyDashboard'

interface AddDrugLocationProps {
  openModal: boolean
  onClose: () => void
}

interface IFormValues {
  location: number | string;
  main: boolean;
  notes?: string;
}

const AddDrugLocation: React.FC<AddDrugLocationProps> = ({ openModal, onClose }) => {

  const { showPromiseToast } = useToast();

  const [addDrugLocation, { isLoading }] = useAddDrugLocationMutation();

  const handleFormSubmit = async (values: IFormValues) => {

    const payload = {
      location: values.location,
      notes: values.notes,
      main: values.main
    }

    const promise = addDrugLocation(payload).unwrap()

    showPromiseToast(
      promise,
      {
        loading: 'Adding...',
        success: (data) => data || 'Added Successfully',
        error: (data) => data || 'Adding Failed'
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
    location: '',
    notes: '',
    main: false
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: AddDrugLocationValidationSchema,
    enableReinitialize: true
  })

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Add Drug Location</DialogTitle>
      <DialogContent>
        <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2}>
            <Grid item lg={4}>
              <TextField
                fullWidth
                name='location'
                label="Location"
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
            <Button variant='contained' color='primary' type='submit' disabled={isLoading || _.isEqual(initialValues, formik.values)} sx={{ width: 'fit-content' }}>
              Save
            </Button>
            <Button variant='contained' color='secondary' sx={{ width: 'fit-content' }} onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default AddDrugLocation
