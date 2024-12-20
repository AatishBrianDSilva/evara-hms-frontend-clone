import React, { useEffect, RefObject } from 'react';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers';
import { useToast } from '../../context/ToastContext';
import { DonorRegistrationValidationSchemaFromHospital } from '../../yup/patient';
import { useAddDonorMutation } from '../../services/donorApi';
import FileUploadButton from '../../components/FileUploadAndPreview/FileUploadButton';
import { EBuckets } from '../../types/global';
import FieldAutocomplete from '../../components/FieldAutoComplete/FieldAutoComplete';
import { useGetReferralDoctorsQuery } from '../../services/masterDashboardService/local/referralDoctorApi';
import { useGetPatientIdTypesQuery } from '../../services/masterDashboardService/local/patientIdTypeApi';
import { useGetPatientSourcesQuery } from '../../services/masterDashboardService/local/patientSourceApi';

const columnSpacing = 2;
const rowSpacing = 2;

const generateRandomUserId = (): string => {
  const randomPart = Math.random().toString(36).substr(2, 9);
  const timestampPart = Date.now().toString(36);
  return `donorFromHospital-${timestampPart}-${randomPart}`;
};

const DonorRegistrationFromHospital: React.FC = () => {
  const inputRefs: Record<string, RefObject<any>> = {};
  const { showPromiseToast } = useToast();

  // const [_selectedImage, setSelectedImage] = useState<File | null>(null);
  const [addDonor, { isLoading }] = useAddDonorMutation();

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>(['']);

  //import referral doctors
  const {
    data: DoctorData,
    isLoading: DoctorLoading,
    isFetching: DoctorFetching,
  } = useGetReferralDoctorsQuery({
    paginate: false,
    filters: { isAdmin: true, isGlobal: false },
  });

  const Doctors = DoctorData?.data || [];
  const doctorsLoading = DoctorLoading || DoctorFetching;

  // console.log("Doctor Data", Doctors);

  //import idtypes
  const {
    data: IDTypeData,
    isLoading: IDTypeLoading,
    isFetching: IDTypeFetching,
  } = useGetPatientIdTypesQuery({
    paginate: false,
    filters: { isAdmin: true, isGlobal: false },
  });

  const IDTypes = IDTypeData?.data || [];
  const idLoading = IDTypeLoading || IDTypeFetching;

  // console.log(" ID Type Data", IDTypes);

  const {
    data: PatientSourceData,
    isLoading: PatientSourceLoading,
    isFetching: PatientSourceFetching,
  } = useGetPatientSourcesQuery({
    paginate: false,
    filters: { isAdmin: true, isGlobal: false },
  });

  const PatientSources = PatientSourceData?.data || [];
  const sourceLoading = PatientSourceLoading || PatientSourceFetching;

  // console.log("Patient Source Data", PatientSources);

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

  const handleSubmit = async (values: any) => {
    values.image = fileUploadedUrl[0];
    const promise = addDonor(values).unwrap();

    showPromiseToast(promise, {
      loading: 'Adding Donor...',
      success: response => response.message || 'Donor added successfully',
      error: err =>
        `Error: ${err.response?.data?.message || 'Failed to add donor'}`,
    });

    try {
      await promise;
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
      dob: null,
      education: '',
      maritalStatus: '',
      bloodGroup: '',
      countryBirth: '',
      nationality: '',
      motherTounge: '',
      occupation: '',
      religion: '',
      mobile: '',
      alernativeMobile: '',
      email: '',
      dependentType: false,
      dependentName: '',
      dependentRelation: '',
      dependentMobile: '',
      dependentEmail: '',
      addressLine1: '',
      addressLine2: '',
      state: '',
      city: '',
      pincode: '',
      idProofType: '',
      idProofNumber: '',
      idProofIssuedCountry: '',
      ABHANumber: '',
      isPatientDeceased: false,
      isDonor: false,
      hiv: '',
      height: '',
      Build: '',
      Ethnicity: '',
      HealthLooks: '',
      faceColour: '',
      eyeColour: '',
      haircolour: '',
      RHantibody: '',
      skinTone: '',
      complexion: '',
      referrerName: '',
      marketingSource: '',
      intepreter: false,
      congenitaldeformities: false,
      geneticAcquiredDisease: '',
      historyOfChronicIllness: '',
      seriousDisease: '',
      seriousDiseaserelative: '',
      isPatientInsured: false,
      remarks: '',
    },
    validationSchema: DonorRegistrationValidationSchemaFromHospital,
    onSubmit: handleSubmit,
    validateOnBlur: true,
  });

  Object.keys(formik.initialValues).forEach(key => {
    inputRefs[key] = React.createRef();
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

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Personal Details */}
      <Typography variant="h6">Personal Information</Typography>
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
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
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
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
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
          <DatePicker
            ref={inputRefs.dob}
            sx={{ width: '100%' }}
            timezone="Asia/Kolkata"
            label="Date of Birth"
            name="dob"
            format="dd/MM/yyyy"
            value={formik.values.dob}
            onChange={value => formik.setFieldValue('dob', value)}
            slots={TextField}
            slotProps={{
              textField: {
                fullWidth: true,
                error: formik.touched.dob && Boolean(formik.errors.dob),
                helperText: formik.touched.dob && formik.errors.dob,
              },
            }}
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
            error={formik.touched.education && Boolean(formik.errors.education)}
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
            ref={inputRefs.countryBirth}
            fullWidth
            id="register-countryBirth-id"
            name="countryBirth"
            label="Country of Birth"
            placeholder="Country of Birth"
            value={formik.values.countryBirth}
            onChange={formik.handleChange}
            error={
              formik.touched.countryBirth && Boolean(formik.errors.countryBirth)
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
              formik.touched.nationality && Boolean(formik.errors.nationality)
            }
            helperText={formik.touched.nationality && formik.errors.nationality}
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
              formik.touched.motherTounge && Boolean(formik.errors.motherTounge)
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
            helperText={formik.touched.occupation && formik.errors.occupation}
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
            error={formik.touched.religion && Boolean(formik.errors.religion)}
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
            fullWidth
            id="register-mobile-id"
            label="Mobile"
            name="mobile"
            type="number"
            onChange={event => {
              const value = event.target.value;
              if (value.length <= 10) {
                formik.setFieldValue('mobile', value);
              }
            }}
            value={formik.values.mobile}
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            id="register-alernativeMobile-id"
            label="Alernative Mobile"
            name="alernativeMobile"
            value={formik.values.alernativeMobile}
            type="number"
            onChange={event => {
              const value = event.target.value;
              if (value.length <= 10) {
                formik.setFieldValue('alernativeMobile', value);
              }
            }}
            error={
              formik.touched.alernativeMobile &&
              Boolean(formik.errors.alernativeMobile)
            }
            helperText={
              formik.touched.alernativeMobile && formik.errors.alernativeMobile
            }
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
      <Typography variant="h6">Guardian Information</Typography>
      <Grid
        container
        rowSpacing={rowSpacing}
        columnSpacing={columnSpacing}
        mt={1}
      >
        <Grid item xs={12} sm={12} md={12}>
          <FormControlLabel
            label="Guardian"
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
                  formik.touched.dependentName && formik.errors.dependentName
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
                fullWidth
                id="register-dependentMobile-id"
                label="Dependent Mobile"
                name="dependentMobile"
                placeholder="Dependent Mobile"
                value={formik.values.dependentMobile}
                type="number" // Keep numeric keyboard for better UX
                onChange={event => {
                  const value = event.target.value;
                  if (value.length <= 10) {
                    formik.setFieldValue('dependentMobile', value);
                  }
                }}
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
                  formik.touched.dependentEmail && formik.errors.dependentEmail
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
              formik.touched.addressLine1 && Boolean(formik.errors.addressLine1)
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
              formik.touched.addressLine2 && Boolean(formik.errors.addressLine2)
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
            loading={false} // Update if you have loading state
            value={formik.values.state}
            onChange={value => {
              formik.setFieldValue('state', value);
            }}
            error={formik.touched.state && Boolean(formik.errors.state)}
            helperText={formik.touched.state && formik.errors.state}
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
            inputMode="numeric"
            placeholder="Pincode"
            value={formik.values.pincode}
            type="number"
            onChange={event => {
              const value = event.target.value;
              if (value.length <= 6) {
                formik.setFieldValue('pincode', value);
              }
            }}
            error={formik.touched.pincode && Boolean(formik.errors.pincode)}
            helperText={formik.touched.pincode && formik.errors.pincode}
            inputProps={{ maxLength: 6 }}
          />
        </Grid>
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
          <FieldAutocomplete
            label="ID Proof"
            options={IDTypes.map(type => type.name)}
            isOptionEqualToValue={(option, value) => option === value}
            getOptionLabel={option => option}
            loading={idLoading}
            value={formik.values.idProofType}
            onChange={value => {
              formik.setFieldValue('idProofType', value);
            }}
          />
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
            type="number"
            onChange={event => {
              const value = event.target.value;
              if (value.length <= 14) {
                formik.setFieldValue('ABHANumber', value);
              }
            }}
            error={
              formik.touched.ABHANumber && Boolean(formik.errors.ABHANumber)
            }
            helperText={formik.touched.ABHANumber && formik.errors.ABHANumber}
          />
        </Grid>
      </Grid>
      <Divider sx={{ marginY: 6 }} />
      {/* ID Proof Details */}

      <Grid
        container
        rowSpacing={rowSpacing}
        columnSpacing={columnSpacing}
        mt={1}
      >
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs.hiv}
            fullWidth
            id="hiv"
            name="hiv"
            label="HIV & HbAg(OutSide /Own Lab)"
            value={formik.values.hiv}
            onChange={formik.handleChange}
            error={formik.touched.hiv && Boolean(formik.errors.hiv)}
            helperText={formik.touched.hiv && formik.errors.hiv}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs.height}
            fullWidth
            id="height"
            name="height"
            label="Height"
            placeholder="Height"
            value={formik.values.height}
            onChange={formik.handleChange}
            error={formik.touched.height && Boolean(formik.errors.height)}
            helperText={formik.touched.height && formik.errors.height}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs.Build}
            fullWidth
            id="Build"
            name="Build"
            label="Build"
            value={formik.values.Build}
            onChange={formik.handleChange}
            error={formik.touched.Build && Boolean(formik.errors.Build)}
            helperText={formik.touched.Build && formik.errors.Build}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs.Ethnicity}
            fullWidth
            id="Ethnicity"
            name="Ethnicity"
            label="Ethnicity"
            placeholder="Ethnicity"
            value={formik.values.Ethnicity}
            onChange={formik.handleChange}
            error={formik.touched.Ethnicity && Boolean(formik.errors.Ethnicity)}
            helperText={formik.touched.Ethnicity && formik.errors.Ethnicity}
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
        <Grid item lg={2}>
          <TextField
            ref={inputRefs.HeathLooks}
            select
            fullWidth
            id="HealthLooks"
            name="HealthLooks"
            label="Health Looks"
            value={formik.values.HealthLooks}
            onChange={formik.handleChange}
            error={
              formik.touched.HealthLooks && Boolean(formik.errors.HealthLooks)
            }
            helperText={formik.touched.HealthLooks && formik.errors.HealthLooks}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Fair">Fair</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Olive">Olive</MenuItem>
            <MenuItem value="Dark">Dark</MenuItem>
          </TextField>
        </Grid>

        <Grid item lg={2}>
          <TextField
            ref={inputRefs.faceColour}
            select
            fullWidth
            id="faceColour"
            name="faceColour"
            label="Face Colour"
            value={formik.values.faceColour}
            onChange={formik.handleChange}
            error={
              formik.touched.faceColour && Boolean(formik.errors.faceColour)
            }
            helperText={formik.touched.faceColour && formik.errors.faceColour}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Fair">Fair</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Olive">Olive</MenuItem>
            <MenuItem value="Dark">Dark</MenuItem>
          </TextField>
        </Grid>

        <Grid item lg={2}>
          <TextField
            ref={inputRefs.eyeColour}
            select
            fullWidth
            id="eyeColour"
            name="eyeColour"
            label="Eye Colour"
            value={formik.values.eyeColour}
            onChange={formik.handleChange}
            error={formik.touched.eyeColour && Boolean(formik.errors.eyeColour)}
            helperText={formik.touched.eyeColour && formik.errors.eyeColour}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Fair">Fair</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Olive">Olive</MenuItem>
            <MenuItem value="Dark">Dark</MenuItem>
          </TextField>
        </Grid>

        <Grid item lg={2}>
          <TextField
            ref={inputRefs.haircolour}
            select
            fullWidth
            id="haircolour"
            name="haircolour"
            label="Hair Colour"
            value={formik.values.haircolour}
            onChange={formik.handleChange}
            error={
              formik.touched.haircolour && Boolean(formik.errors.haircolour)
            }
            helperText={formik.touched.haircolour && formik.errors.haircolour}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Fair">Fair</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Olive">Olive</MenuItem>
            <MenuItem value="Dark">Dark</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs.RHantibody}
            fullWidth
            id="RHantibody"
            name="RHantibody"
            label="RH antibody"
            placeholder="RH Antibody"
            value={formik.values.RHantibody}
            onChange={formik.handleChange}
            error={
              formik.touched.RHantibody && Boolean(formik.errors.RHantibody)
            }
            helperText={formik.touched.RHantibody && formik.errors.RHantibody}
          />
        </Grid>

        <Grid item lg={2}>
          <TextField
            ref={inputRefs.skinTone}
            select
            fullWidth
            id="register-skinTone-id"
            name="skinTone"
            label="Skin Tone"
            value={formik.values.skinTone}
            onChange={formik.handleChange}
            error={formik.touched.skinTone && Boolean(formik.errors.skinTone)}
            helperText={formik.touched.skinTone && formik.errors.skinTone}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Fair">Fair</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Olive">Olive</MenuItem>
            <MenuItem value="Dark">Dark</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs.complexion}
            select
            fullWidth
            id="register-complexion-id"
            name="complexion"
            label="Complexion"
            value={formik.values.complexion}
            onChange={formik.handleChange}
            error={
              formik.touched.complexion && Boolean(formik.errors.complexion)
            }
            helperText={formik.touched.complexion && formik.errors.complexion}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Fair">Fair</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Olive">Olive</MenuItem>
            <MenuItem value="Dark">Dark</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FieldAutocomplete
            label="Referred By"
            options={Doctors.map(referrer => referrer.name)}
            isOptionEqualToValue={(option, value) => option === value}
            getOptionLabel={option => option}
            loading={doctorsLoading}
            value={formik.values.referrerName}
            onChange={value => {
              formik.setFieldValue('referrerName', value);
            }}
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
        <Grid item xs={12} sm={6} md={3}>
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

        <Grid item xs={12} sm={6} md={3.5}>
          <FormControlLabel
            label="Any Congentital deformities"
            control={
              <Checkbox
                id="congenitaldeformities"
                name="congenitaldeformities"
                value={formik.values.congenitaldeformities}
                onChange={formik.handleChange}
              />
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs.historyOfChronicIllness}
            select
            fullWidth
            id="geneticAcquiredDisease"
            name="geneticAcquiredDisease"
            label="Any Genetic  Acquired Disease"
            value={formik.values.geneticAcquiredDisease}
            onChange={formik.handleChange}
            error={
              formik.touched.geneticAcquiredDisease &&
              Boolean(formik.errors.geneticAcquiredDisease)
            }
            helperText={
              formik.touched.geneticAcquiredDisease &&
              formik.errors.geneticAcquiredDisease
            }
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Hypertension">Hypertension</MenuItem>
            <MenuItem value="Diabetes">Diabetes</MenuItem>
            <MenuItem value="Asthma">Asthma</MenuItem>
            <MenuItem value="Thyroid Disease">Thyroid Disease</MenuItem>
            <MenuItem value="Arthritis">Arthritis</MenuItem>
            <MenuItem value="Heart Disease">Heart Disease</MenuItem>
            <MenuItem value="Kidney Disease">Kidney Disease</MenuItem>
            <MenuItem value="Liver Disease">Liver Disease</MenuItem>
            <MenuItem value="Lung Disease">Lung Disease</MenuItem>
            <MenuItem value="Cancer">Cancer</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs.historyOfChronicIllness}
            select
            fullWidth
            id="register-historyOfChronicIllness-id"
            name="historyOfChronicIllness"
            label="History of any Chronic Illness"
            value={formik.values.historyOfChronicIllness}
            onChange={formik.handleChange}
            error={
              formik.touched.historyOfChronicIllness &&
              Boolean(formik.errors.historyOfChronicIllness)
            }
            helperText={
              formik.touched.historyOfChronicIllness &&
              formik.errors.historyOfChronicIllness
            }
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Hypertension">Hypertension</MenuItem>
            <MenuItem value="Diabetes">Diabetes</MenuItem>
            <MenuItem value="Asthma">Asthma</MenuItem>
            <MenuItem value="Thyroid Disease">Thyroid Disease</MenuItem>
            <MenuItem value="Arthritis">Arthritis</MenuItem>
            <MenuItem value="Heart Disease">Heart Disease</MenuItem>
            <MenuItem value="Kidney Disease">Kidney Disease</MenuItem>
            <MenuItem value="Liver Disease">Liver Disease</MenuItem>
            <MenuItem value="Lung Disease">Lung Disease</MenuItem>
            <MenuItem value="Cancer">Cancer</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs.seriousDisease}
            select
            fullWidth
            id="register-seriousDiseaserelative-id"
            name="seriousDiseaserelative"
            label="Serious Disease to any realtive"
            value={formik.values.seriousDiseaserelative}
            onChange={formik.handleChange}
            error={
              formik.touched.seriousDiseaserelative &&
              Boolean(formik.errors.seriousDiseaserelative)
            }
            helperText={
              formik.touched.seriousDiseaserelative &&
              formik.errors.seriousDiseaserelative
            }
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Cancer">Cancer</MenuItem>
            <MenuItem value="Heart Disease">Heart Disease</MenuItem>
            <MenuItem value="Diabetes">Diabetes</MenuItem>
            <MenuItem value="Stroke">Stroke</MenuItem>
            <MenuItem value="Kidney Disease">Kidney Disease</MenuItem>
            <MenuItem value="Liver Disease">Liver Disease</MenuItem>
            <MenuItem value="Lung Disease">Lung Disease</MenuItem>
            <MenuItem value="Alzheimer's Disease">Alzheimer's Disease</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            ref={inputRefs.seriousDisease}
            select
            fullWidth
            id="register-seriousDisease-id"
            name="seriousDisease"
            label="Serious Disease in Family"
            value={formik.values.seriousDisease}
            onChange={formik.handleChange}
            error={
              formik.touched.seriousDisease &&
              Boolean(formik.errors.seriousDisease)
            }
            helperText={
              formik.touched.seriousDisease && formik.errors.seriousDisease
            }
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Cancer">Cancer</MenuItem>
            <MenuItem value="Heart Disease">Heart Disease</MenuItem>
            <MenuItem value="Diabetes">Diabetes</MenuItem>
            <MenuItem value="Stroke">Stroke</MenuItem>
            <MenuItem value="Kidney Disease">Kidney Disease</MenuItem>
            <MenuItem value="Liver Disease">Liver Disease</MenuItem>
            <MenuItem value="Lung Disease">Lung Disease</MenuItem>
            <MenuItem value="Alzheimer's Disease">Alzheimer's Disease</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>
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
            label="Is Patient Insured"
            control={
              <Checkbox
                id="register-isPatientInsured-id"
                name="isPatientInsured"
                checked={formik.values.isPatientInsured}
                onChange={formik.handleChange}
              />
            }
          />
        </Grid>
      </Grid>
      <Divider sx={{ marginY: 6 }} />
      {/* Image */}
      <Typography variant="h6">Profile Photo</Typography>
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
          sx={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button type="submit" variant="outlined" disabled={isLoading}>
            {isLoading ? 'Adding patient' : 'Save'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default DonorRegistrationFromHospital;
