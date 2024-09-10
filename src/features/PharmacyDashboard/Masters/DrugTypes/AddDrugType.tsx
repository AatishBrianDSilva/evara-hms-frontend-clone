import React from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useToast } from '../../../../context/ToastContext'
import { useAddDrugTypeMutation } from '../../../../services/pharmacyDashboardService/master/drugTypeApi'
import _ from 'lodash'
import { AddDrugTypeValidationSchema } from '../../../../yup/pharmacyDashboard'

interface AddDrugTypeProps {
  openModal: boolean
  onClose: () => void
}

interface IFormValues {
  name: string;
  shortcode: string;
  notes?: string;
}

const AddDrugType: React.FC<AddDrugTypeProps> = ({ openModal, onClose }) => {

  const { showPromiseToast } = useToast();

  const [addDrugType, { isLoading }] = useAddDrugTypeMutation();

  const handleFormSubmit = async (values: IFormValues) => {

    const payload = {
      name: values.name,
      shortcode: values.shortcode,
      notes: values.notes
    }

    const promise = addDrugType(payload).unwrap()

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
    name: '',
    shortcode: '',
    notes: ''
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: AddDrugTypeValidationSchema,
    enableReinitialize: true
  })

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Add Drug Type</DialogTitle>
      <DialogContent>
        <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2}>
            <Grid item lg={4}>
              <TextField
                fullWidth
                name='name'
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item lg={4}>
              <TextField
                fullWidth
                name='shortcode'
                label="Short Code"
                value={formik.values.shortcode}
                onChange={formik.handleChange}
                error={formik.touched.shortcode && Boolean(formik.errors.shortcode)}
                helperText={formik.touched.shortcode && formik.errors.shortcode}
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
          </Grid>
          {/* {JSON.stringify(formik.errors)} */}
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

export default AddDrugType
