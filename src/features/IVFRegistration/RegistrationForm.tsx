import React, { useEffect, useState, RefObject } from 'react'
import { useFormik } from 'formik'
import { PatientRegistrationValidationSchema } from "../../utils/yup"
import { Button, Checkbox, Divider, FormControlLabel, Grid, MenuItem, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { useAddPatientMutation } from '../../services/ivfRegistrationApi';
import { VisuallyHiddenInput } from '../../components/Utils/VisuallyHiddenInput';
import { useToast } from '../../context/ToastContext'

const RegistrationForm: React.FC = () => {

  const inputRefs: Record<string, RefObject<any>> = {};
  const { showPromiseToast } = useToast();
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.down('sm'));
  const [columnSpacing, setColumnSpacing] = useState(1);
  const [rowSpacing, setRowSpacing] = useState(2.5);

  useEffect(() => {
    if (isDesktop) {
      setColumnSpacing(2);
      setRowSpacing(2.5);
    } else {
      setColumnSpacing(1);
      setRowSpacing(2.5);
    }
  }, [isDesktop])


  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [addPatient, { isLoading }] = useAddPatientMutation();

  const handleSubmit = async (values: any) => {
    const promise = addPatient(values).unwrap();

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
      gender: '',
      age: '',
      dob: Date.now(),
      education: '',
      maritalStatus: '',
      bloodGroup: '',
      countryBirth: '',
      nationality: '',
      motherTounge: '',
      occupation: '',
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

  Object.keys(formik.initialValues).forEach(key => {
    inputRefs[key] = React.createRef();
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedImage(files[0]);
      console.log(selectedImage);
      formik.setFieldValue('image', files[0].name);
    }
  };

  useEffect(() => {
    if (Object.keys(formik.errors).length > 0 && formik.isSubmitting) {
      const firstErrorKey = Object.keys(formik.errors)[0];
      const errorRef = inputRefs[firstErrorKey];
      if (errorRef && errorRef.current) {
        errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [formik.errors, formik.isSubmitting]);


  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Personal Details */}
      <Typography variant="h6">
        Personal Information
      </Typography>
      <Grid container rowSpacing={rowSpacing} columnSpacing={columnSpacing} mt={1}>
        <Grid item xs={4} sm={6} md={2}>
          <TextField
            ref={inputRefs["title"]}
            select
            fullWidth
            id='register-title-id'
            name="title"
            label="Title"
            placeholder='Title'
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
          >
            <MenuItem value="Mr">Mr</MenuItem>
            <MenuItem value="Mrs">Mrs</MenuItem>
            <MenuItem value="Miss">Miss</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={8} sm={6} md={4}>
          <TextField
            ref={inputRefs["firstName"]}
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
            ref={inputRefs["lastName"]}
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
        <Grid item xs={8} sm={6} md={2}>
          <TextField
            ref={inputRefs["gender"]}
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
        <Grid item xs={4} sm={6} md={2}>
          <TextField
            ref={inputRefs["age"]}
            fullWidth
            id='register-age-id'
            name="age"
            label="Age"
            // type='number'
            placeholder='Age'
            value={formik.values.age}
            onChange={formik.handleChange}
            error={formik.touched.age && Boolean(formik.errors.age)}
            helperText={formik.touched.age && formik.errors.age}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <DatePicker
            ref={inputRefs["dob"]}
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
            ref={inputRefs["education"]}
            fullWidth
            id='register-education-id'
            name="education"
            label="Education"
            placeholder='Education'
            value={formik.values.education}
            onChange={formik.handleChange}
            error={formik.touched.education && Boolean(formik.errors.education)}
            helperText={formik.touched.education && formik.errors.education}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            ref={inputRefs["maritalStatus"]}
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
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            ref={inputRefs["bloodGroup"]}
            select
            fullWidth
            id='register-bloodGroup-id'
            name='bloodGroup'
            label="Blood Group"
            value={formik.values.bloodGroup}
            onChange={formik.handleChange}
            error={formik.touched.bloodGroup && Boolean(formik.errors.bloodGroup)}
            helperText={formik.touched.bloodGroup && formik.errors.bloodGroup}
          >
            <MenuItem value="A+">A+</MenuItem>
            <MenuItem value="A-">A-</MenuItem>
            <MenuItem value="B+">B+</MenuItem>
            <MenuItem value="B-">B-</MenuItem>
            <MenuItem value="AB+">AB+</MenuItem>
            <MenuItem value="AB-">AB-</MenuItem>
            <MenuItem value="O+">O+</MenuItem>
            <MenuItem value="O-">O-</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            ref={inputRefs["countryBirth"]}
            fullWidth
            id='register-countryBirth-id'
            name="countryBirth"
            label="Country of Birth"
            placeholder='Country of Birth'
            value={formik.values.countryBirth}
            onChange={formik.handleChange}
            error={formik.touched.countryBirth && Boolean(formik.errors.countryBirth)}
            helperText={formik.touched.countryBirth && formik.errors.countryBirth}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            ref={inputRefs["nationality"]}
            fullWidth
            id='register-nationality-id'
            name="nationality"
            label="Nationality"
            placeholder='Nationality'
            value={formik.values.nationality}
            onChange={formik.handleChange}
            error={formik.touched.nationality && Boolean(formik.errors.nationality)}
            helperText={formik.touched.nationality && formik.errors.nationality}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            ref={inputRefs["motherTounge"]}
            fullWidth
            id='register-motherTounge-id'
            name="motherTounge"
            label="Mother Tounge"
            placeholder='Mother Tounge'
            value={formik.values.motherTounge}
            onChange={formik.handleChange}
            error={formik.touched.motherTounge && Boolean(formik.errors.motherTounge)}
            helperText={formik.touched.motherTounge && formik.errors.motherTounge}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            ref={inputRefs["occupation"]}
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
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            ref={inputRefs["religion"]}
            fullWidth
            id='register-religion-id'
            name="religion"
            label="Religion"
            placeholder='Religion'
            value={formik.values.religion}
            onChange={formik.handleChange}
            error={formik.touched.religion && Boolean(formik.errors.religion)}
            helperText={formik.touched.religion && formik.errors.religion}
          />
        </Grid>
      </Grid>
      <Divider sx={{ marginY: 6 }} />
      {/* Contact Details */}
      <Typography variant="h6" >
        Contact Information
      </Typography>
      <Grid container rowSpacing={rowSpacing} columnSpacing={columnSpacing} mt={1}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            ref={inputRefs["mobile"]}
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
            ref={inputRefs["alernativeMobile"]}
            fullWidth
            id='register-alernativeMobile-id'
            name="alernativeMobile"
            label="Alternative Mobile"
            placeholder='Alternative Mobile'
            value={formik.values.alernativeMobile}
            onChange={formik.handleChange}
            error={formik.touched.alernativeMobile && Boolean(formik.errors.alernativeMobile)}
            helperText={formik.touched.alernativeMobile && formik.errors.alernativeMobile}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            ref={inputRefs["email"]}
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
      </Grid>
      <Divider sx={{ marginY: 6 }} />
      {/* Dependent Details */}
      <Typography variant="h6">
        Gaurdian Information
      </Typography>
      <Grid container rowSpacing={rowSpacing} columnSpacing={columnSpacing} mt={1}>
        <Grid item xs={12} sm={12} md={12}>
          <FormControlLabel label="Gaurdian" control={<Checkbox
            id='dependentType-id'
            name="dependentType"
            value={formik.values.dependentType}
            onChange={formik.handleChange}
          />} />
        </Grid>
        {formik.values.dependentType && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                ref={inputRefs["dependentName"]}
                fullWidth
                id='register-dependentName-id'
                name="dependentName"
                label="Dependent Name"
                placeholder='Dependent Name'
                value={formik.values.dependentName}
                onChange={formik.handleChange}
                error={formik.touched.dependentName && Boolean(formik.errors.dependentName)}
                helperText={formik.touched.dependentName && formik.errors.dependentName}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                ref={inputRefs["dependentRelation"]}
                fullWidth
                id='register-dependentRelation-id'
                name="dependentRelation"
                label="Dependent Relation"
                placeholder='Dependent Relation'
                value={formik.values.dependentRelation}
                onChange={formik.handleChange}
                error={formik.touched.dependentRelation && Boolean(formik.errors.dependentRelation)}
                helperText={formik.touched.dependentRelation && formik.errors.dependentRelation}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                ref={inputRefs["dependentMobile"]}
                fullWidth
                id='register-dependentMobile-id'
                name="dependentMobile"
                label="Dependent Mobile"
                placeholder='Dependent Mobile'
                value={formik.values.dependentMobile}
                onChange={formik.handleChange}
                error={formik.touched.dependentMobile && Boolean(formik.errors.dependentMobile)}
                helperText={formik.touched.dependentMobile && formik.errors.dependentMobile}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                ref={inputRefs["dependentEmail"]}
                fullWidth
                id='register-dependentEmail-id'
                name="dependentEmail"
                label="Dependent Email"
                placeholder='Dependent Email'
                value={formik.values.dependentEmail}
                onChange={formik.handleChange}
                error={formik.touched.dependentEmail && Boolean(formik.errors.dependentEmail)}
                helperText={formik.touched.dependentEmail && formik.errors.dependentEmail}
              />
            </Grid>
          </>
        )}
      </Grid>
      <Divider sx={{ marginY: 6 }} />
      {/* Address Details */}
      <Typography variant="h6">
        Address
      </Typography>
      <Grid container rowSpacing={rowSpacing} columnSpacing={columnSpacing} mt={1}>
        <Grid item xs={12} sm={6} md={6}>
          <TextField
            ref={inputRefs["addressLine1"]}
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
            ref={inputRefs["addressLine2"]}
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
            ref={inputRefs["state"]}
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
            ref={inputRefs["city"]}
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
            ref={inputRefs["pincode"]}
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
        {/* <Grid item xs={12} sm={6} md={2}>
          <TextField
          ref={inputRefs["firstName"]}
            select
            fullWidth
            id='register-country-id'
            name='country'
            label="Country"
            value={formik.values.country}
            onChange={formik.handleChange}
            error={formik.touched.country && Boolean(formik.errors.country)}
            helperText={formik.touched.country && formik.errors.country}
          >
            <MenuItem value="India">India</MenuItem>
            <MenuItem value="USA">USA</MenuItem>
          </TextField>
        </Grid> */}
      </Grid>
      <Divider sx={{ marginY: 6 }} />
      {/* ID Proof Details */}
      <Typography variant="h6">
        Identity Information
      </Typography>
      <Grid container rowSpacing={rowSpacing} columnSpacing={columnSpacing} mt={1}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs["idProofType"]}
            select
            fullWidth
            id='register-idProof-id'
            name='idProofType'
            label="ID Proof"
            value={formik.values.idProofType}
            onChange={formik.handleChange}
            error={formik.touched.idProofType && Boolean(formik.errors.idProofType)}
            helperText={formik.touched.idProofType && formik.errors.idProofType}
          >
            <MenuItem value="Aadhar Card">Aadhar Card</MenuItem>
            <MenuItem value="Passport">Passport</MenuItem>
            <MenuItem value="Driving License">Driving License</MenuItem>
            <MenuItem value="Voter ID">Voter ID</MenuItem>
            <MenuItem value="PAN Card">PAN Card</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs["idProofNumber"]}
            fullWidth
            id='register-idProofNumber-id'
            name="idProofNumber"
            label="ID Proof Number"
            placeholder='ID Proof Number'
            value={formik.values.idProofNumber}
            onChange={formik.handleChange}
            error={formik.touched.idProofNumber && Boolean(formik.errors.idProofNumber)}
            helperText={formik.touched.idProofNumber && formik.errors.idProofNumber}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs["idProofIssuedCountry"]}
            select
            fullWidth
            id='register-idProofIssuedCountry-id'
            name='idProofIssuedCountry'
            label="ID Proof Issued Country"
            value={formik.values.idProofIssuedCountry}
            onChange={formik.handleChange}
            error={formik.touched.idProofIssuedCountry && Boolean(formik.errors.idProofIssuedCountry)}
            helperText={formik.touched.idProofIssuedCountry && formik.errors.idProofIssuedCountry}
          >
            <MenuItem value="India">India</MenuItem>
            <MenuItem value="USA">USA</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs["ABHANumber"]}
            fullWidth
            id='register-idProofAbhaNumber-id'
            name="ABHANumber"
            label="ABHA Number"
            placeholder='ABHA Number'
            value={formik.values.ABHANumber}
            onChange={formik.handleChange}
            error={formik.touched.ABHANumber && Boolean(formik.errors.ABHANumber)}
            helperText={formik.touched.ABHANumber && formik.errors.ABHANumber}
          />
        </Grid>
      </Grid>
      <Divider sx={{ marginY: 6 }} />
      {/* Additional Details */}
      <Typography variant="h6">
        Additional Information
      </Typography>
      <Grid container rowSpacing={rowSpacing} columnSpacing={columnSpacing} mt={1}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs["reasonOfVisit"]}
            fullWidth
            id='register-reasonOfVisit-id'
            name="reasonOfVisit"
            label="Reason Of Visit"
            placeholder='Reason Of Visit'
            value={formik.values.reasonOfVisit}
            onChange={formik.handleChange}
            error={formik.touched.reasonOfVisit && Boolean(formik.errors.reasonOfVisit)}
            helperText={formik.touched.reasonOfVisit && formik.errors.reasonOfVisit}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs["referredBy"]}
            fullWidth
            id='register-referredBy-id'
            name="referredBy"
            label="Referred By"
            placeholder='Referred By'
            value={formik.values.referredBy}
            onChange={formik.handleChange}
            error={formik.touched.referredBy && Boolean(formik.errors.referredBy)}
            helperText={formik.touched.referredBy && formik.errors.referredBy}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs["referrerName"]}
            fullWidth
            id='register-referredByDoctor-id'
            name="referrerName"
            label="Referred Name"
            placeholder='Referred Name'
            value={formik.values.referrerName}
            onChange={formik.handleChange}
            error={formik.touched.referrerName && Boolean(formik.errors.referrerName)}
            helperText={formik.touched.referrerName && formik.errors.referrerName}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs["marketingSource"]}
            fullWidth
            id='register-marketingSource-id'
            name="marketingSource"
            label="Marketing Source"
            placeholder='Marketing Source'
            value={formik.values.marketingSource}
            onChange={formik.handleChange}
            error={formik.touched.marketingSource && Boolean(formik.errors.marketingSource)}
            helperText={formik.touched.marketingSource && formik.errors.marketingSource}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControlLabel label="Interpreter" control={<Checkbox
            id='register-intepreter-id'
            name="intepreter"
            value={formik.values.intepreter}
            onChange={formik.handleChange}
          />} />
        </Grid>
        {formik.values.intepreter && (<Grid item xs={12} sm={6} md={3.5}>
          <TextField
            ref={inputRefs["intepreterName"]}
            fullWidth
            id='register-intepreterName-id'
            name="intepreterName"
            label="Inteprete Name"
            placeholder='Inteprete Name'
            value={formik.values.intepreterName}
            onChange={formik.handleChange}
            error={formik.touched.intepreterName && Boolean(formik.errors.intepreterName)}
            helperText={formik.touched.intepreterName && formik.errors.intepreterName}
          />
        </Grid>)}
        <Grid item xs={12} sm={6} md={3.5}>
          <FormControlLabel label="Patient Surrogate" control={<Checkbox
            id='register-isPatientSurrogate-id'
            name="isPatientSurrogate"
            value={formik.values.isPatientSurrogate}
            onChange={formik.handleChange}
          />} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControlLabel label="Patient Deceased" control={<Checkbox
            id='register-isPatientDeceased-id'
            name="isPatientDeceased"
            value={formik.values.isPatientDeceased}
            onChange={formik.handleChange}
          />} />
        </Grid>
        {formik.values.isPatientDeceased && (
          <Grid item xs={12} sm={6} md={8}>
            <TextField
              ref={inputRefs["detailsOfDeath"]}
              fullWidth
              id='register-detailsOfDeath-id'
              name="detailsOfDeath"
              label="Details Of Death"
              placeholder='Details Of Death'
              value={formik.values.detailsOfDeath}
              onChange={formik.handleChange}
              error={formik.touched.detailsOfDeath && Boolean(formik.errors.detailsOfDeath)}
              helperText={formik.touched.detailsOfDeath && formik.errors.detailsOfDeath}
            />
          </Grid>)}
      </Grid>
      <Divider sx={{ marginY: 6 }} />
      {/* Insurance Details */}
      <Typography variant="h6">
        Insurance Information
      </Typography>
      <Grid container rowSpacing={rowSpacing} columnSpacing={columnSpacing} mt={1}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControlLabel label="Patient Insured" control={<Checkbox
            id='register-isPatientInsured-id'
            name="isPatientInsured"
            value={formik.values.isPatientInsured}
            onChange={formik.handleChange}
          />} />
        </Grid>
        {formik.values.isPatientInsured && (
          <><Grid item xs={12} sm={6} md={8}>
            {/* Spacer */}
          </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                ref={inputRefs["insuranceSponsorName"]}
                fullWidth
                id='register-insuranceCompany-id'
                name="insuranceSponsorName"
                label="Insurance Company"
                placeholder='Insurance Company'
                value={formik.values.insuranceSponsorName}
                onChange={formik.handleChange}
                error={formik.touched.insuranceSponsorName && Boolean(formik.errors.insuranceSponsorName)}
                helperText={formik.touched.insuranceSponsorName && formik.errors.insuranceSponsorName}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                ref={inputRefs["insurancePolicyHolderName"]}
                fullWidth
                id='register-insuranceNumber-id'
                name="insurancePolicyHolderName"
                label="Insurance Policy Holder Name"
                placeholder='Insurance Name'
                value={formik.values.insurancePolicyHolderName}
                onChange={formik.handleChange}
                error={formik.touched.insurancePolicyNumber && Boolean(formik.errors.insurancePolicyNumber)}
                helperText={formik.touched.insurancePolicyNumber && formik.errors.insurancePolicyNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                ref={inputRefs["insurancePolicyNumber"]}
                fullWidth
                id='register-insurancePolicyNumber-id'
                name="insurancePolicyNumber"
                label="Insurance Policy Number"
                placeholder='Insurance Policy Number'
                value={formik.values.insurancePolicyNumber}
                onChange={formik.handleChange}
                error={formik.touched.insurancePolicyNumber && Boolean(formik.errors.insurancePolicyNumber)}
                helperText={formik.touched.insurancePolicyNumber && formik.errors.insurancePolicyNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                ref={inputRefs["insuranceAmountEligible"]}
                fullWidth
                id='register-insuranceAmountEligible-id'
                name="insuranceAmountEligible"
                label="Amount Eligible"
                placeholder='Amount Eligible'
                value={formik.values.insuranceAmountEligible}
                onChange={formik.handleChange}
                error={formik.touched.insuranceAmountEligible && Boolean(formik.errors.insuranceAmountEligible)}
                helperText={formik.touched.insuranceAmountEligible && formik.errors.insuranceAmountEligible}
              />
            </Grid>
          </>)}
      </Grid>
      <Divider sx={{ marginY: 6 }} />
      {/* Image */}
      <Typography variant="h6">
        Image
      </Typography>
      <Grid container rowSpacing={rowSpacing} columnSpacing={columnSpacing} mt={1}>
        <Grid item xs={12} sm={6} md={2}>
          <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
            Upload
            <VisuallyHiddenInput onChange={handleImageChange} type="file" accept="image/*" />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={10}>
          <TextField
            ref={inputRefs["remarks"]}
            multiline
            minRows={1}
            fullWidth
            id='register-remarks-id'
            name="remarks"
            label="Remarks"
            placeholder='Remarks'
            value={formik.values.remarks}
            onChange={formik.handleChange}
            error={formik.touched.remarks && Boolean(formik.errors.remarks)}
            helperText={formik.touched.remarks && formik.errors.remarks}
          />
        </Grid>
      </Grid>
      <Divider sx={{ marginY: 6 }} />
      {/* Submit */}
      <Grid container rowSpacing={rowSpacing} columnSpacing={columnSpacing} mt={1}>
        <Grid item xs={12} sm={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {isLoading ? (
            <Button variant="outlined" disabled>
              Saving
            </Button>
          ) : (
            <Button variant="outlined" type="submit">
              Save
            </Button>
          )
          }
        </Grid>
      </Grid>
    </form>
  );
}

export default RegistrationForm;