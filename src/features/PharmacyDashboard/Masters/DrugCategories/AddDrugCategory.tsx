import React from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useToast } from '../../../../context/ToastContext'
import { useAddDrugCategoryMutation } from '../../../../services/pharmacyDashboardService/master/drugCategoryApi'
import _ from 'lodash'
import { AddDrugCategoryValidationSchema } from '../../../../yup/pharmacyDashboard'

interface AddDrugCategoryProps {
  openModal: boolean
  onClose: () => void
}

interface IFormValues {
  name: string;
  notes?: string;
}

const AddDrugCategory: React.FC<AddDrugCategoryProps> = ({ openModal, onClose }) => {

  const { showPromiseToast } = useToast();

  const [addDrugCategory, { isLoading }] = useAddDrugCategoryMutation();

  const handleFormSubmit = async (values: IFormValues) => {

    const payload = {
      name: values.name,
      notes: values.notes
    }

    const promise = addDrugCategory(payload).unwrap()

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
    notes: ''
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: AddDrugCategoryValidationSchema,
    enableReinitialize: true
  })

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Add Drug Category</DialogTitle>
      <DialogContent>
        <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2}>
            <Grid item lg={4}>
              <TextField
                fullWidth
                name='name'
                label="Category"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
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

export default AddDrugCategory
