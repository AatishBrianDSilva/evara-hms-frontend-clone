import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import React, { RefObject, useEffect, useState } from 'react';
// import { PatientRegistrationValidationSchema } from "../../yup/patient";
import {
  useUpdatePatientMutation,
  useGetPatientByIdQuery,
} from '../../services/patientsApi';
import { useToast } from '../../context/ToastContext';
import FileUploadButton from '../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets } from '../../types/global';
import { useDispatch } from 'react-redux';
import { setPatient } from './patientsSlice';

import _ from 'lodash';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';
import { IPatient } from '../../types/patient';
import FieldAutocomplete from '../../components/FieldAutoComplete/FieldAutoComplete';
import { useGetPatientSourcesQuery } from '../../services/masterDashboardService/local/patientSourceApi';

interface IEditPatient {
  openEditPatientModal: boolean;
  onClose: (value: boolean) => void;
  id: string;
}

const generateRandomUserId = (): string => {
  const randomPart = Math.random().toString(36).substr(2, 9);
  const timestampPart = Date.now().toString(36);
  return `user-${timestampPart}-${randomPart}`;
};

const rowSpacing = 2;
const columnSpacing = 2;

const EditPatient: React.FC<IEditPatient> = ({
  openEditPatientModal,
  onClose,
  id,
}) => {
  const inputRefs: Record<string, RefObject<any>> = {};
  const { showPromiseToast } = useToast();
  const dispatch = useDispatch();

  console.log('ID received in EditPatient:', id);

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep',
    'Delhi',
    'Puducherry',
    'Ladakh',
    'Jammu and Kashmir',
  ];

  const { data: patientData } = useGetPatientByIdQuery(id);

  // console.log("fetched data", patientData);

  const currentPatient: IPatient = patientData?.data.patient;
  const patientId = currentPatient?.patientId;

  // const patient = useSelector((state: RootState) => state.patients.patient);

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>([]);

  const [IdUploadedUrl, setIdUploadedUrl] = React.useState<string[]>([]);

  const [userId] = useState<string>(generateRandomUserId());

  const [updatePatient, { isLoading }] = useUpdatePatientMutation();

  const {
    data: PatientSourceData,
    isLoading: PatientSourceLoading,
    isFetching: PatientSourceFetching,
  } = useGetPatientSourcesQuery({
    paginate: false,
    filters: { isAdmin: true, isGlobal: false },
  });

  const sourceLoading = PatientSourceFetching || PatientSourceLoading;

  const PatientSources = PatientSourceData?.data || [];

  const handleSubmit = async (values: any) => {
    values.image = fileUploadedUrl[0];
    values.identifications = IdUploadedUrl;
    const promise = updatePatient({ patientId, values }).unwrap();

    showPromiseToast(promise, {
      loading: 'Updating Patient',
      success: response => response.message || 'Patient Updated Successfully',
      error: err =>
        `Error: ${err.response?.data?.message || 'Failed to update patient'}`,
    });

    try {
      const response = await promise;
      // Update Redux state with the updated patient data
      if (response?.data) {
        dispatch(setPatient(response.data));
      }
      handleFormClose();
    } catch (error: any) {
      console.error('Failed to update patient', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      //Personal Details
      title: currentPatient?.title || '',
      firstName: currentPatient?.firstName || '',
      lastName: currentPatient?.lastName || '',
      gender: currentPatient?.gender || '',
      dob: currentPatient?.dob || null,
      education: currentPatient?.education || '',
      maritalStatus: currentPatient?.maritalStatus || '',
      bloodGroup: currentPatient?.bloodGroup || '',
      countryBirth: currentPatient?.countryBirth || '',
      nationality: currentPatient?.nationality || '',
      motherTounge: currentPatient?.motherTounge || '',
      occupation: currentPatient?.occupation || '',
      religion: currentPatient?.religion || '',
      //Contact Details
      mobile: currentPatient?.mobile || '',
      alernativeMobile: currentPatient?.alernativeMobile || '',
      email: currentPatient?.email || '',
      //Dependent Details
      dependentType: currentPatient?.dependentType || false,
      dependentName: currentPatient?.dependentName || '',
      dependentRelation: currentPatient?.dependentRelation || '',
      dependentMobile: currentPatient?.dependentMobile || '',
      dependentEmail: currentPatient?.dependentEmail || '',
      //Address Details
      addressLine1: currentPatient?.addressLine1 || '',
      addressLine2: currentPatient?.addressLine2 || '',
      state: currentPatient?.state || '',
      city: currentPatient?.city || '',
      pincode: currentPatient?.pincode || '',
      //ID Proof Details
      idProofType: currentPatient?.idProofType || '',
      idProofNumber: currentPatient?.idProofNumber || '',
      idProofIssuedCountry: currentPatient?.idProofIssuedCountry || '',
      ABHANumber: currentPatient?.ABHANumber || '',
      //Other Details
      reasonOfVisit: currentPatient?.reasonOfVisit || '',
      referredBy: currentPatient?.referredBy || '',
      referrerName: currentPatient?.referrerName || '',
      marketingSource: currentPatient?.marketingSource || '',
      intepreter: currentPatient?.intepreter || false,
      intepreterName: currentPatient?.intepreterName || '',
      isPatientSurrogate: currentPatient?.isPatientSurrogate || false,
      isPatientDeceased: currentPatient?.isPatientDeceased || false,
      detailsOfDeath: currentPatient?.detailsOfDeath || '',
      //Insurance Details
      isPatientInsured: currentPatient?.isPatientInsured || false,
      insuranceSponsorName: currentPatient?.insuranceSponsorName || '',
      insurancePolicyNumber: currentPatient?.insurancePolicyNumber || '',
      insurancePolicyHolderName:
        currentPatient?.insurancePolicyHolderName || '',
      insuranceAmountEligible: currentPatient?.insuranceAmountEligible || '',
      //Image
      image: currentPatient?.image || '',
      identifications: currentPatient?.identifications || '',
      remarks: currentPatient?.remarks || '',
    },
    // validationSchema: PatientRegistrationValidationSchema,
    onSubmit: handleSubmit,
    validateOnBlur: true,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (Object.keys(formik.errors).length > 0 && formik.isSubmitting) {
      const firstErrorKey = Object.keys(formik.errors)[0];
      const errorRef = inputRefs[firstErrorKey];
      if (errorRef?.current) {
        errorRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [formik.errors, formik.isSubmitting]);

  const handleFormClose = () => {
    onClose(false);
    formik.resetForm();
  };

  return (
    <Modal
      open={openEditPatientModal}
      onClose={() => {
        handleFormClose();
      }}
      aria-labelledby="modal-patient-dashboard-edit-patient-title"
      aria-describedby="modal-modal-patient-dashboard-edit-patient-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1000, // Set a fixed width or use a responsive width
          maxHeight: '80vh', // Maximum height before scrolling
          overflowY: 'auto', // Enable vertical scrolling
          borderRadius: 1,
          boxShadow: 5,
          px: 8,
          py: 5,
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          id="modal-patient-title"
          textAlign={'center'}
          variant="h6"
          component="h2"
          mb={2}
        >
          Edit Patient
        </Typography>
        {/* Display formik errors */}
        {/* <pre>{JSON.stringify(formik.errors)}</pre> */}
        <form onSubmit={formik.handleSubmit}>
          {/* Personal Details */}
          <Typography variant="h6">Patient Information</Typography>
          <Grid
            container
            rowSpacing={rowSpacing}
            columnSpacing={columnSpacing}
            mt={1}
          >
            <Grid item xs={4} sm={6} md={2}>
              <TextField
                ref={inputRefs.title}
                select
                fullWidth
                id="register-title-id"
                name="title"
                label="Title"
                placeholder="Title"
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
                ref={inputRefs.firstName}
                fullWidth
                id="register-firstName-id"
                name="firstName"
                label="First Name"
                placeholder="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                ref={inputRefs.lastName}
                fullWidth
                id="register-lastName-id"
                name="lastName"
                label="Last Name"
                placeholder="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={8} sm={6} md={2}>
              <TextField
                ref={inputRefs.gender}
                select
                fullWidth
                id="register-gender-id"
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
            <Grid item xs={12} sm={6} md={2}>
              <CustomDatePicker
                ref={inputRefs.dob}
                label="Date of Birth"
                name="dob"
                value={formik.values.dob ? new Date(formik.values.dob) : null}
                onChange={value => formik.setFieldValue('dob', value)}
                error={formik.touched.dob && Boolean(formik.errors.dob)}
                helperText={formik.touched.dob && formik.errors.dob}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                ref={inputRefs.education}
                fullWidth
                id="register-education-id"
                name="education"
                label="Education"
                placeholder="Education"
                value={formik.values.education}
                onChange={formik.handleChange}
                error={
                  formik.touched.education && Boolean(formik.errors.education)
                }
                helperText={formik.touched.education && formik.errors.education}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                ref={inputRefs.maritalStatus}
                select
                fullWidth
                id="register-maritalStatus-id"
                name="maritalStatus"
                label="Marital Status"
                value={formik.values.maritalStatus}
                onChange={formik.handleChange}
                error={
                  formik.touched.maritalStatus &&
                  Boolean(formik.errors.maritalStatus)
                }
                helperText={
                  formik.touched.maritalStatus && formik.errors.maritalStatus
                }
              >
                <MenuItem value="Married">Married</MenuItem>
                <MenuItem value="Unmarried">Unmarried</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                ref={inputRefs.bloodGroup}
                select
                fullWidth
                id="register-bloodGroup-id"
                name="bloodGroup"
                label="Blood Group"
                value={formik.values.bloodGroup}
                onChange={formik.handleChange}
                error={
                  formik.touched.bloodGroup && Boolean(formik.errors.bloodGroup)
                }
                helperText={
                  formik.touched.bloodGroup && formik.errors.bloodGroup
                }
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
                ref={inputRefs.countryBirth}
                fullWidth
                id="register-countryBirth-id"
                name="countryBirth"
                label="Country of Birth"
                placeholder="Country of Birth"
                value={formik.values.countryBirth}
                onChange={formik.handleChange}
                error={
                  formik.touched.countryBirth &&
                  Boolean(formik.errors.countryBirth)
                }
                helperText={
                  formik.touched.countryBirth && formik.errors.countryBirth
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                ref={inputRefs.nationality}
                fullWidth
                id="register-nationality-id"
                name="nationality"
                label="Nationality"
                placeholder="Nationality"
                value={formik.values.nationality}
                onChange={formik.handleChange}
                error={
                  formik.touched.nationality &&
                  Boolean(formik.errors.nationality)
                }
                helperText={
                  formik.touched.nationality && formik.errors.nationality
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                ref={inputRefs.motherTounge}
                fullWidth
                id="register-motherTounge-id"
                name="motherTounge"
                label="Mother Tounge"
                placeholder="Mother Tounge"
                value={formik.values.motherTounge}
                onChange={formik.handleChange}
                error={
                  formik.touched.motherTounge &&
                  Boolean(formik.errors.motherTounge)
                }
                helperText={
                  formik.touched.motherTounge && formik.errors.motherTounge
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                ref={inputRefs.occupation}
                fullWidth
                id="register-occupation-id"
                name="occupation"
                label="Occupation"
                placeholder="Occupation"
                value={formik.values.occupation}
                onChange={formik.handleChange}
                error={
                  formik.touched.occupation && Boolean(formik.errors.occupation)
                }
                helperText={
                  formik.touched.occupation && formik.errors.occupation
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                ref={inputRefs.religion}
                fullWidth
                id="register-religion-id"
                name="religion"
                label="Religion"
                placeholder="Religion"
                value={formik.values.religion}
                onChange={formik.handleChange}
                error={
                  formik.touched.religion && Boolean(formik.errors.religion)
                }
                helperText={formik.touched.religion && formik.errors.religion}
              />
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 6 }} />
          {/* Contact Details */}
          <Typography variant="h6">Contact Information</Typography>
          <Grid
            container
            rowSpacing={rowSpacing}
            columnSpacing={columnSpacing}
            mt={1}
          >
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                ref={inputRefs.mobile}
                fullWidth
                id="register-mobile-id"
                name="mobile"
                label="Mobile"
                placeholder="Mobile"
                inputMode="numeric"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helperText={formik.touched.mobile && formik.errors.mobile}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                ref={inputRefs.alernativeMobile}
                fullWidth
                id="register-alernativeMobile-id"
                name="alernativeMobile"
                label="Alternative Mobile"
                placeholder="Alternative Mobile"
                inputMode="numeric"
                value={formik.values.alernativeMobile}
                onChange={formik.handleChange}
                error={
                  formik.touched.alernativeMobile &&
                  Boolean(formik.errors.alernativeMobile)
                }
                helperText={
                  formik.touched.alernativeMobile &&
                  formik.errors.alernativeMobile
                }
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                ref={inputRefs.email}
                fullWidth
                id="register-email-id"
                name="email"
                label="Email"
                placeholder="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 6 }} />
          {/* Dependent Details */}
          <Typography variant="h6">Gaurdian Information</Typography>
          <Grid
            container
            rowSpacing={rowSpacing}
            columnSpacing={columnSpacing}
            mt={1}
          >
            <Grid item xs={12} sm={12} md={12}>
              <FormControlLabel
                label="Gaurdian"
                control={
                  <Checkbox
                    id="dependentType-id"
                    name="dependentType"
                    value={formik.values.dependentType}
                    onChange={formik.handleChange}
                  />
                }
              />
            </Grid>
            {formik.values.dependentType && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    ref={inputRefs.dependentName}
                    fullWidth
                    id="register-dependentName-id"
                    name="dependentName"
                    label="Dependent Name"
                    placeholder="Dependent Name"
                    value={formik.values.dependentName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.dependentName &&
                      Boolean(formik.errors.dependentName)
                    }
                    helperText={
                      formik.touched.dependentName &&
                      formik.errors.dependentName
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    ref={inputRefs.dependentRelation}
                    fullWidth
                    id="register-dependentRelation-id"
                    name="dependentRelation"
                    label="Dependent Relation"
                    placeholder="Dependent Relation"
                    value={formik.values.dependentRelation}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.dependentRelation &&
                      Boolean(formik.errors.dependentRelation)
                    }
                    helperText={
                      formik.touched.dependentRelation &&
                      formik.errors.dependentRelation
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    ref={inputRefs.dependentMobile}
                    fullWidth
                    id="register-dependentMobile-id"
                    name="dependentMobile"
                    label="Dependent Mobile"
                    placeholder="Dependent Mobile"
                    value={formik.values.dependentMobile}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.dependentMobile &&
                      Boolean(formik.errors.dependentMobile)
                    }
                    helperText={
                      formik.touched.dependentMobile &&
                      formik.errors.dependentMobile
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    ref={inputRefs.dependentEmail}
                    fullWidth
                    id="register-dependentEmail-id"
                    name="dependentEmail"
                    label="Dependent Email"
                    placeholder="Dependent Email"
                    value={formik.values.dependentEmail}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.dependentEmail &&
                      Boolean(formik.errors.dependentEmail)
                    }
                    helperText={
                      formik.touched.dependentEmail &&
                      formik.errors.dependentEmail
                    }
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Divider sx={{ marginY: 6 }} />
          {/* Address Details */}
          <Typography variant="h6">Address</Typography>
          <Grid
            container
            rowSpacing={rowSpacing}
            columnSpacing={columnSpacing}
            mt={1}
          >
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                ref={inputRefs.addressLine1}
                fullWidth
                id="register-addressLine1-id"
                name="addressLine1"
                label="Address Line 1"
                placeholder="Address Line 1"
                value={formik.values.addressLine1}
                onChange={formik.handleChange}
                error={
                  formik.touched.addressLine1 &&
                  Boolean(formik.errors.addressLine1)
                }
                helperText={
                  formik.touched.addressLine1 && formik.errors.addressLine1
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                ref={inputRefs.addressLine2}
                fullWidth
                id="register-addressLine2-id"
                name="addressLine2"
                label="Address Line 2"
                placeholder="Address Line 2"
                value={formik.values.addressLine2}
                onChange={formik.handleChange}
                error={
                  formik.touched.addressLine2 &&
                  Boolean(formik.errors.addressLine2)
                }
                helperText={
                  formik.touched.addressLine2 && formik.errors.addressLine2
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FieldAutocomplete
                label="State"
                options={indianStates}
                isOptionEqualToValue={(option, value) => option === value}
                getOptionLabel={option => option}
                value={formik.values.state}
                onChange={value => {
                  formik.setFieldValue('state', value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                ref={inputRefs.city}
                fullWidth
                id="register-city-id"
                name="city"
                label="City"
                placeholder="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                ref={inputRefs.pincode}
                fullWidth
                id="register-pincode-id"
                name="pincode"
                label="Pincode"
                placeholder="Pincode"
                type="number"
                value={formik.values.pincode}
                onChange={formik.handleChange}
                error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                helperText={formik.touched.pincode && formik.errors.pincode}
                inputProps={{ maxLength: 6 }}
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
          <Typography variant="h6">Identity Information</Typography>
          <Grid
            container
            rowSpacing={rowSpacing}
            columnSpacing={columnSpacing}
            mt={1}
          >
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                ref={inputRefs.idProofType}
                select
                fullWidth
                id="register-idProof-id"
                name="idProofType"
                label="ID Proof"
                value={formik.values.idProofType}
                onChange={formik.handleChange}
                error={
                  formik.touched.idProofType &&
                  Boolean(formik.errors.idProofType)
                }
                helperText={
                  formik.touched.idProofType && formik.errors.idProofType
                }
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
                ref={inputRefs.idProofNumber}
                fullWidth
                id="register-idProofNumber-id"
                name="idProofNumber"
                label="ID Proof Number"
                placeholder="ID Proof Number"
                value={formik.values.idProofNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.idProofNumber &&
                  Boolean(formik.errors.idProofNumber)
                }
                helperText={
                  formik.touched.idProofNumber && formik.errors.idProofNumber
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                ref={inputRefs.idProofIssuedCountry}
                select
                fullWidth
                id="register-idProofIssuedCountry-id"
                name="idProofIssuedCountry"
                label="ID Proof Issued Country"
                value={formik.values.idProofIssuedCountry}
                onChange={formik.handleChange}
                error={
                  formik.touched.idProofIssuedCountry &&
                  Boolean(formik.errors.idProofIssuedCountry)
                }
                helperText={
                  formik.touched.idProofIssuedCountry &&
                  formik.errors.idProofIssuedCountry
                }
              >
                <MenuItem value="India">India</MenuItem>
                <MenuItem value="USA">USA</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                ref={inputRefs.ABHANumber}
                fullWidth
                id="register-idProofAbhaNumber-id"
                name="ABHANumber"
                label="ABHA Number"
                placeholder="ABHA Number"
                value={formik.values.ABHANumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.ABHANumber && Boolean(formik.errors.ABHANumber)
                }
                helperText={
                  formik.touched.ABHANumber && formik.errors.ABHANumber
                }
              />
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 6 }} />
          {/* Additional Details */}
          <Typography variant="h6">Additional Information</Typography>
          <Grid
            container
            rowSpacing={rowSpacing}
            columnSpacing={columnSpacing}
            mt={1}
          >
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                ref={inputRefs.reasonOfVisit}
                fullWidth
                id="register-reasonOfVisit-id"
                name="reasonOfVisit"
                label="Reason Of Visit"
                placeholder="Reason Of Visit"
                value={formik.values.reasonOfVisit}
                onChange={formik.handleChange}
                error={
                  formik.touched.reasonOfVisit &&
                  Boolean(formik.errors.reasonOfVisit)
                }
                helperText={
                  formik.touched.reasonOfVisit && formik.errors.reasonOfVisit
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                ref={inputRefs.referredBy}
                fullWidth
                id="register-referredBy-id"
                name="referredBy"
                label="Referred By"
                placeholder="Referred By"
                value={formik.values.referredBy}
                onChange={formik.handleChange}
                error={
                  formik.touched.referredBy && Boolean(formik.errors.referredBy)
                }
                helperText={
                  formik.touched.referredBy && formik.errors.referredBy
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                ref={inputRefs.referrerName}
                fullWidth
                id="register-referredByDoctor-id"
                name="referrerName"
                label="Referrer Name"
                placeholder="Referrer Name"
                value={formik.values.referrerName}
                onChange={formik.handleChange}
                error={
                  formik.touched.referrerName &&
                  Boolean(formik.errors.referrerName)
                }
                helperText={
                  formik.touched.referrerName && formik.errors.referrerName
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FieldAutocomplete
                label="Marketing Source"
                options={PatientSources.map(source => source.name)}
                isOptionEqualToValue={(option, value) => option === value}
                getOptionLabel={option => option}
                loading={sourceLoading}
                value={formik.values.marketingSource}
                onChange={value => {
                  formik.setFieldValue('marketingSource', value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                label="Interpreter"
                control={
                  <Checkbox
                    id="register-intepreter-id"
                    name="intepreter"
                    value={formik.values.intepreter}
                    onChange={formik.handleChange}
                  />
                }
              />
            </Grid>
            {formik.values.intepreter && (
              <Grid item xs={12} sm={6} md={3.5}>
                <TextField
                  ref={inputRefs.intepreterName}
                  fullWidth
                  id="register-intepreterName-id"
                  name="intepreterName"
                  label="Inteprete Name"
                  placeholder="Inteprete Name"
                  value={formik.values.intepreterName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.intepreterName &&
                    Boolean(formik.errors.intepreterName)
                  }
                  helperText={
                    formik.touched.intepreterName &&
                    formik.errors.intepreterName
                  }
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={3.5}>
              <FormControlLabel
                label="Patient Surrogate"
                control={
                  <Checkbox
                    id="register-isPatientSurrogate-id"
                    name="isPatientSurrogate"
                    value={formik.values.isPatientSurrogate}
                    onChange={formik.handleChange}
                  />
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                label="Patient Deceased"
                control={
                  <Checkbox
                    id="register-isPatientDeceased-id"
                    name="isPatientDeceased"
                    value={formik.values.isPatientDeceased}
                    onChange={formik.handleChange}
                  />
                }
              />
            </Grid>
            {formik.values.isPatientDeceased && (
              <Grid item xs={12} sm={6} md={8}>
                <TextField
                  ref={inputRefs.detailsOfDeath}
                  fullWidth
                  id="register-detailsOfDeath-id"
                  name="detailsOfDeath"
                  label="Details Of Death"
                  placeholder="Details Of Death"
                  value={formik.values.detailsOfDeath}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.detailsOfDeath &&
                    Boolean(formik.errors.detailsOfDeath)
                  }
                  helperText={
                    formik.touched.detailsOfDeath &&
                    formik.errors.detailsOfDeath
                  }
                />
              </Grid>
            )}
          </Grid>
          <Divider sx={{ marginY: 6 }} />
          {/* Insurance Details */}
          <Typography variant="h6">Insurance Information</Typography>
          <Grid
            container
            rowSpacing={rowSpacing}
            columnSpacing={columnSpacing}
            mt={1}
          >
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                label="Patient Insured"
                control={
                  <Checkbox
                    id="register-isPatientInsured-id"
                    name="isPatientInsured"
                    value={formik.values.isPatientInsured}
                    onChange={formik.handleChange}
                  />
                }
              />
            </Grid>
            {formik.values.isPatientInsured && (
              <>
                <Grid item xs={12} sm={6} md={8}>
                  {/* Spacer */}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    ref={inputRefs.insuranceSponsorName}
                    fullWidth
                    id="register-insuranceCompany-id"
                    name="insuranceSponsorName"
                    label="Insurance Company"
                    placeholder="Insurance Company"
                    value={formik.values.insuranceSponsorName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.insuranceSponsorName &&
                      Boolean(formik.errors.insuranceSponsorName)
                    }
                    helperText={
                      formik.touched.insuranceSponsorName &&
                      formik.errors.insuranceSponsorName
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    ref={inputRefs.insurancePolicyHolderName}
                    fullWidth
                    id="register-insuranceNumber-id"
                    name="insurancePolicyHolderName"
                    label="Insurance Policy Holder Name"
                    placeholder="Insurance Name"
                    value={formik.values.insurancePolicyHolderName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.insurancePolicyNumber &&
                      Boolean(formik.errors.insurancePolicyNumber)
                    }
                    helperText={
                      formik.touched.insurancePolicyNumber &&
                      formik.errors.insurancePolicyNumber
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    ref={inputRefs.insurancePolicyNumber}
                    fullWidth
                    id="register-insurancePolicyNumber-id"
                    name="insurancePolicyNumber"
                    label="Insurance Policy Number"
                    placeholder="Insurance Policy Number"
                    value={formik.values.insurancePolicyNumber}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.insurancePolicyNumber &&
                      Boolean(formik.errors.insurancePolicyNumber)
                    }
                    helperText={
                      formik.touched.insurancePolicyNumber &&
                      formik.errors.insurancePolicyNumber
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    ref={inputRefs.insuranceAmountEligible}
                    fullWidth
                    id="register-insuranceAmountEligible-id"
                    name="insuranceAmountEligible"
                    label="Amount Eligible"
                    placeholder="Amount Eligible"
                    value={formik.values.insuranceAmountEligible}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.insuranceAmountEligible &&
                      Boolean(formik.errors.insuranceAmountEligible)
                    }
                    helperText={
                      formik.touched.insuranceAmountEligible &&
                      formik.errors.insuranceAmountEligible
                    }
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Divider sx={{ marginY: 6 }} />
          {/* Image */}
          <Typography variant="h6">Image</Typography>
          <Grid
            container
            rowSpacing={rowSpacing}
            columnSpacing={columnSpacing}
            mt={1}
          >
            <Grid item xs={12}>
              <FileUploadButton
                acceptTypes="image/*"
                maxFiles={1}
                maxFileSizeinMB={5}
                onUploadFiles={setFileUploadedUrl}
                bucket={EBuckets.UserProfiles}
                user={generateRandomUserId()}
              />
            </Grid>

            <Grid container pl={2} pt={2}>
              <Typography variant="h6">ID Documentation</Typography>
              <Grid item xs={12} pt={2}>
                <FileUploadButton
                  acceptTypes="image/*, application/pdf"
                  maxFiles={5}
                  maxFileSizeinMB={15}
                  onUploadFiles={setIdUploadedUrl}
                  bucket={EBuckets.UserIdentifications}
                  user={userId}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={10}>
              <TextField
                ref={inputRefs.remarks}
                multiline
                minRows={1}
                fullWidth
                id="register-remarks-id"
                name="remarks"
                label="Remarks"
                placeholder="Remarks"
                value={formik.values.remarks}
                onChange={formik.handleChange}
                error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                helperText={formik.touched.remarks && formik.errors.remarks}
              />
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 6 }} />
          {/* Submit */}
          {/* {JSON.stringify(formik.errors)} */}
          <Grid
            container
            rowSpacing={rowSpacing}
            columnSpacing={columnSpacing}
            mt={1}
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Button
                type="submit"
                variant="outlined"
                disabled={
                  isLoading ||
                  (_.isEqual(formik.values, formik.initialValues) &&
                    fileUploadedUrl[0] === '' &&
                    IdUploadedUrl[0] === '')
                }
              >
                {isLoading ? 'Updating patient' : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default EditPatient;
