import { Box, Divider, Grid, MenuItem, Modal, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import { PatientRegistrationValidationSchema } from '../../utils/yup'
import { useAddPartnerMutation } from '../../services/patientsApi'
import { useToast } from '../../context/ToastContext'
import { DatePicker } from '@mui/x-date-pickers'

interface IPatientDashboardAddPartnerProps {
  openAddPartnerModal: boolean
  onClose: (value: boolean) => void
}

const PatientDashboardAddPartner: React.FC<IPatientDashboardAddPartnerProps> = ({ openAddPartnerModal, onClose }) => {

  const { showPromiseToast } = useToast();
  const [addPartner, { isLoading }] = useAddPartnerMutation();

  const handleSubmit = async (values: any) => {
    const promise = addPartner(values).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding patient',
      success: (response) => response.message || 'Patient added successfully',
      error: (err) => `Error: ${err.response?.data?.message || 'Failed to add patient'}`
    });

    try {
      const response = await promise;
      console.log(response);
      formik.resetForm();
    } catch (error: any) {
      console.error('Failed to add patient', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      //Personal Details
      title: '',
      firstName: '',
      lastName: '',
      occupation: '',
      gender: '',
      dob: Date.now(),
      maritalStatus: '',
      bloodGroup: '',
      countryBirth: '',
      nationality: '',
      motherTounge: '',
      religion: '',
      //Contact Details
      mobile: '',
      alernativeMobile: '',
      email: '',
      //Dependent Details
      dependentType: false,
      dependentName: '',
      dependentRelation: '',
      dependentMobile: '',
      dependentEmail: '',
      //Address Details
      addressLine1: '',
      addressLine2: '',
      state: '',
      city: '',
      pincode: '',
      // country: '',
      //ID Proof Details
      idProofType: '',
      idProofNumber: '',
      idProofIssuedCountry: '',
      ABHANumber: '',
      //Other Details
      reasonOfVisit: '',
      referredBy: '',
      referrerName: '',
      marketingSource: '',
      intepreter: false,
      intepreterName: '',
      isPatientSurrogate: false,
      isPatientDeceased: false,
      detailsOfDeath: '',
      //Insurance Details
      isPatientInsured: false,
      // insuranceCompany: '',
      insuranceSponsorName: '',
      insurancePolicyNumber: '',
      insurancePolicyHolderName: '',
      insuranceAmountEligible: '',
      //Image
      image: '',
      remarks: '',
    },
    validationSchema: PatientRegistrationValidationSchema,
    onSubmit: handleSubmit,
    validateOnBlur: true,
  })

  return (
    <Modal
      open={openAddPartnerModal}
      onClose={() => onClose(false)}
      aria-labelledby="modal-patient-dashboard-add-partner-title"
      aria-describedby="modal-modal-patient-dashboard-add-partner-description"
    >
      <Box position={"absolute"} top={"50%"} left={"50%"} width={"40%"} borderRadius={1} boxShadow={5} p={4} bgcolor={"background.paper"} sx={{
        transform: 'translate(-50%, -50%)',
      }}>
        <Typography id="modal-modal-title" textAlign={"center"} variant="h6" component="h2">
          Register Partner
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="h6">
            Personal Information
          </Typography>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id='register-firstName-id'
                name="firstName"
                label="First Name"
                placeholder='First Name'
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id='register-lastName-id'
                name="lastName"
                label="Last Name"
                placeholder='Last Name'
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                sx={{ width: '100%' }}
                timezone='Asia/Kolkata'
                label="Date of Birth"
                name='dob'
                format='dd/MM/yyyy'
                value={formik.values.dob}
                onChange={(value) => formik.setFieldValue('dob', value)}
                onAccept={console.log}
                onError={console.log}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id='register-occupation-id'
                name="occupation"
                label="Occupation"
                placeholder='Occupation'
                value={formik.values.occupation}
                onChange={formik.handleChange}
                error={formik.touched.occupation && Boolean(formik.errors.occupation)}
                helperText={formik.touched.occupation && formik.errors.occupation}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id='register-mobile-id'
                name="mobile"
                label="Mobile"
                placeholder='Mobile'
                value={formik.values.mobile}
                onChange={formik.handleChange}
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helperText={formik.touched.mobile && formik.errors.mobile}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id='register-email-id'
                name="email"
                label="Email"
                placeholder='Email'
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                id='register-gender-id'
                name="gender"
                label="Gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                helperText={formik.touched.gender && formik.errors.gender}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                id='register-maritalStatus-id'
                name='maritalStatus'
                label="Marital Status"
                value={formik.values.maritalStatus}
                onChange={formik.handleChange}
                error={formik.touched.maritalStatus && Boolean(formik.errors.maritalStatus)}
                helperText={formik.touched.maritalStatus && formik.errors.maritalStatus}
              >
                <MenuItem value="Married">Married</MenuItem>
                <MenuItem value="Unmarried">Unmarried</MenuItem>
              </TextField>
            </Grid>
          </Grid>



          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                id='register-addressLine1-id'
                name="addressLine1"
                label="Address Line 1"
                placeholder='Address Line 1'
                value={formik.values.addressLine1}
                onChange={formik.handleChange}
                error={formik.touched.addressLine1 && Boolean(formik.errors.addressLine1)}
                helperText={formik.touched.addressLine1 && formik.errors.addressLine1}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                id='register-addressLine2-id'
                name="addressLine2"
                label="Address Line 2"
                placeholder='Address Line 2'
                value={formik.values.addressLine2}
                onChange={formik.handleChange}
                error={formik.touched.addressLine2 && Boolean(formik.errors.addressLine2)}
                helperText={formik.touched.addressLine2 && formik.errors.addressLine2}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id='register-state-id'
                name="state"
                label="State"
                placeholder='State'
                value={formik.values.state}
                onChange={formik.handleChange}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id='register-city-id'
                name="city"
                label="City"
                placeholder='City'
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id='register-pincode-id'
                name="pincode"
                label="Pincode"
                placeholder='Pincode'
                value={formik.values.pincode}
                onChange={formik.handleChange}
                error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                helperText={formik.touched.pincode && formik.errors.pincode}
              />
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 6 }} />
        </form>
      </Box>
    </Modal>
  )

}

export default PatientDashboardAddPartner