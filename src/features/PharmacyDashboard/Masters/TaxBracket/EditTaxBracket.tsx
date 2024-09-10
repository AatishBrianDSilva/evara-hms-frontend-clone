import React from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Skeleton, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useToast } from '../../../../context/ToastContext'
import { useEditTaxBracketMutation, useGetTaxBracketByIdQuery } from '../../../../services/pharmacyDashboardService/master/taxBracketApi'
import _ from 'lodash'
import { AddTaxBracketValidationSchema } from '../../../../yup/pharmacyDashboard'

interface EditTaxBracketProps {
  openModal: boolean
  onClose: () => void,
  id: string
}

interface IFormValues {
  taxRate: number | string;
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

const EditTaxBracket: React.FC<EditTaxBracketProps> = ({ openModal, onClose, id }) => {

  const { showPromiseToast } = useToast();

  const { data: taxBracketData, isFetching: istaxRateFetching, isLoading: istaxRateLoading } = useGetTaxBracketByIdQuery(id);
  const taxRate = taxBracketData?.data;
  const taxRateLoading = istaxRateFetching || istaxRateLoading;

  const [editTaxBracket, { isLoading }] = useEditTaxBracketMutation();
  const handleFormSubmit = async (values: IFormValues) => {

    const payload = {
      id,
      taxRate: values.taxRate,
      notes: values.notes
    }

    const promise = editTaxBracket(payload).unwrap()

    showPromiseToast(
      promise,
      {
        loading: 'Editing Tax Bracket...',
        success: (data) => data || 'Tax Bracket Edited Successfully',
        error: (data) => data || 'Failed to Edit Tax Bracket'
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
    taxRate: taxRate?.taxRate || '',
    notes: taxRate?.notes || ''
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: AddTaxBracketValidationSchema,
    enableReinitialize: true
  })

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Edit Tax Bracket</DialogTitle>
      {taxRateLoading ? skeletonLoader() : (<DialogContent>
        <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2}>
            <Grid item lg={4}>
              <TextField
                fullWidth
                name='taxRate'
                label="Tax Rate"
                value={formik.values.taxRate}
                onChange={formik.handleChange}
                error={formik.touched.taxRate && Boolean(formik.errors.taxRate)}
                helperText={formik.touched.taxRate && formik.errors.taxRate}
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
      </DialogContent>)}
    </Dialog>
  )
}

export default EditTaxBracket
