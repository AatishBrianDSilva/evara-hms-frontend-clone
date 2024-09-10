import React from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import { useFormik } from 'formik'

import { useAddDrugItemMutation } from '../../../../services/pharmacyDashboardService/master/drugItemApi'
import _ from 'lodash'
import {   RolesValidationSchema } from '../../../../yup/masterDashboard'

import { IDrugCategory, IDrugManufacturer, IDrugType, ITaxRate } from '../../../../types/pharmacyDashboard/master'

interface AddDrugItemProps {
  openModal: boolean
  onClose: () => void
  drugCategories: IDrugCategory[]
  drugTypes: IDrugType[]
  drugManufacturers: IDrugManufacturer[]
  taxRates: ITaxRate[]
}
interface IFormValues {
    doctorName: string;
    contactNumber: string;
    city: string;
    speciality: string;
}

const AddRoles: React.FC<AddDrugItemProps> = ({ openModal, onClose }) => {



  const [, { isLoading }] = useAddDrugItemMutation();

  const handleFormSubmit = async () => {

console.log("handle ");

  }

  const initialValues: IFormValues = {
    doctorName: '',
    contactNumber: '',
    city: '',
    speciality: '',
  }


  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: RolesValidationSchema,
    enableReinitialize: true
  })

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Add Roles</DialogTitle>
      <DialogContent>
        <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
        <Grid container spacing={2} mb={2} mt={2}>
            <Grid item lg={4}>
              <TextField
                fullWidth
                id="doctorName"
                name="doctorName"
                label="Doctor Name"
                value={formik.values.doctorName}
                onChange={formik.handleChange}
                error={formik.touched.doctorName && Boolean(formik.errors.doctorName)}
                helperText={formik.touched.doctorName && formik.errors.doctorName}
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
                error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                helperText={formik.touched.contactNumber && formik.errors.contactNumber}
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
                error={formik.touched.speciality && Boolean(formik.errors.speciality)}
                helperText={formik.touched.speciality && formik.errors.speciality}
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

export default AddRoles
