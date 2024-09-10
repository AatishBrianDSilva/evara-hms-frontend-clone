import React from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Skeleton, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useToast } from '../../../../context/ToastContext'
import { useEditDrugCategoryMutation, useGetDrugCategoryByIdQuery } from '../../../../services/pharmacyDashboardService/master/drugCategoryApi'
import _ from 'lodash'
import { AddDrugCategoryValidationSchema } from '../../../../yup/pharmacyDashboard'

interface EditDrugCategoryProps {
  openModal: boolean
  onClose: () => void,
  id: string
}

interface IFormValues {
  name: string;
  notes?: string;
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

const EditDrugCategory: React.FC<EditDrugCategoryProps> = ({ openModal, onClose, id }) => {

  const { showPromiseToast } = useToast();

  const { data, isFetching, isLoading } = useGetDrugCategoryByIdQuery(id);
  const category = data?.data;
  const loading = isFetching || isLoading;

  const [editDrugCategory, { isLoading: editLoading }] = useEditDrugCategoryMutation();
  const handleFormSubmit = async (values: IFormValues) => {

    const payload = {
      id,
      name: values.name,
      notes: values.notes
    }

    const promise = editDrugCategory(payload).unwrap()

    showPromiseToast(
      promise,
      {
        loading: 'Editing Drug Category...',
        success: (data) => data || 'Drug Category Edited Successfully',
        error: (data) => data || 'Failed to Edit Drug Category'
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
    name: category?.name || '',
    notes: category?.notes || ''
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: AddDrugCategoryValidationSchema,
    enableReinitialize: true
  })

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Edit Drug Category</DialogTitle>
      {loading ? skeletonLoader() : (<DialogContent>
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

export default EditDrugCategory
