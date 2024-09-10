import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import React from "react";
import { PartnerRegistrationValidationSchema } from "../../../yup/patient";
import { useAddPartnerMutation } from "../../../services/patientsApi";
import { useToast } from "../../../context/ToastContext";
// import { FileUploadAndPreview } from '../../components/FileUploadAndPreview/FileUploadButton'
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import CustomDatePicker from "../../../components/CustomDatePicker/CustomDatePicker";
import FileUploadButton from "../../../components/FileUploadAndPreview/FileUploadButton";
import { EBuckets } from "../../../types/global";
import FieldAutocomplete from "../../../components/FieldAutoComplete/FieldAutoComplete";

interface IPatientDashboardAddPartnerProps {
  openAddPartnerModal: boolean;
  onClose: (value: boolean) => void;
}

const rowSpacing = 2;
const columnSpacing = 2;

const generateRandomUserId = (): string => {
  const randomPart = Math.random().toString(36).substr(2, 9);
  const timestampPart = Date.now().toString(36);
  return `user-${timestampPart}-${randomPart}`;
};

const PatientDashboardAddPartner: React.FC<
  IPatientDashboardAddPartnerProps
> = ({ openAddPartnerModal, onClose }) => {
  const { showPromiseToast } = useToast();
  const [addPartner, { isLoading }] = useAddPartnerMutation();

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry",
    "Ladakh",
    "Jammu and Kashmir",
  ];

  const patientId = useSelector((state: RootState) => state.patients.patientId);

  const [fileUploadedUrl, setFileUploadedUrl] = React.useState<string[]>([""]);

  const handleSubmit = async (values: any) => {
    values.image = fileUploadedUrl[0];
    const promise = addPartner({
      partnerData: values,
      patientId: patientId,
    }).unwrap();

    showPromiseToast(promise, {
      loading: "Adding Partner",
      success: (response) => response || "Partner added successfully",
      error: (err) => `Error: ${err || "Failed to add partner"}`,
    });

    try {
      await promise;
      handleFormClose();
    } catch (error: any) {
      console.error("Failed to add partner", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      //Personal Details
      title: "",
      firstName: "",
      lastName: "",
      occupation: "",
      gender: "",
      dob: null,
      maritalStatus: "",
      bloodGroup: "",
      countryBirth: "",
      nationality: "",
      motherTounge: "",
      religion: "",
      //Contact Details
      mobile: "",
      alernativeMobile: "",
      email: "",
      //Dependent Details
      dependentType: false,
      dependentName: "",
      dependentRelation: "",
      dependentMobile: "",
      dependentEmail: "",
      //Address Details
      addressLine1: "",
      addressLine2: "",
      state: "",
      city: "",
      pincode: "",
      // country: '',
      //ID Proof Details
      idProofType: "",
      idProofNumber: "",
      idProofIssuedCountry: "",
      ABHANumber: "",
      //Image
      image: "",
    },
    validationSchema: PartnerRegistrationValidationSchema,
    onSubmit: handleSubmit,
    validateOnBlur: true,
  });

  const handleFormClose = () => {
    onClose(false);
    formik.resetForm();
  };

  return (
    <Modal
      open={openAddPartnerModal}
      onClose={() => {
        handleFormClose();
      }}
      aria-labelledby="modal-patient-dashboard-add-partner-title"
      aria-describedby="modal-modal-patient-dashboard-add-partner-description"
    >
      <Box
        position={"absolute"}
        top={"50%"}
        left={"50%"}
        width={"40%"}
        borderRadius={1}
        boxShadow={5}
        px={8}
        py={5}
        bgcolor={"background.paper"}
        sx={{
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography
          id="modal-patient-title"
          textAlign={"center"}
          variant="h6"
          component="h2"
          mb={2}
        >
          Register Partner
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="subtitle1" my={1}>
            Personal Information
          </Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
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
            <Grid item xs={12} sm={6} md={4}>
              <CustomDatePicker
                label="Date of Birth"
                name="dob"
                value={formik.values.dob}
                onChange={(value) => formik.setFieldValue("dob", value)}
                error={formik.touched.dob && Boolean(formik.errors.dob)}
                helperText={formik.touched.dob && formik.errors.dob}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
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

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="register-mobile-id"
                name="mobile"
                label="Mobile"
                placeholder="Mobile"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helperText={formik.touched.mobile && formik.errors.mobile}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="register-email-id"
                name="email"
                label="Email"
                placeholder="Email"
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
            <Grid item xs={12} sm={6} md={4}>
              <TextField
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
          </Grid>

          <Divider />

          <Typography variant="subtitle1" my={1}>
            Address
          </Typography>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
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
                getOptionLabel={(option) => option}
                value={formik.values.state}
                onChange={(value) => {
                  formik.setFieldValue("state", value);
                }}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
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
                fullWidth
                id="register-pincode-id"
                name="pincode"
                label="Pincode"
                placeholder="Pincode"
                value={formik.values.pincode}
                onChange={formik.handleChange}
                error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                helperText={formik.touched.pincode && formik.errors.pincode}
                inputProps={{ maxLength: 6 }}
              />
            </Grid>
          </Grid>

          <Divider />

          <Typography variant="subtitle1" my={1}>
            Identity Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
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

          <Box display={"flex"} justifyContent={"center"} gap={1} mt={2} mb={2}>
            {/* <Box flex={1}>
              <FileUploadAndPreview
                labelName='Identity Document'
                color='secondary'
                maxFiles={2}
                previewDirection='column'
                buttonStyle={{ width: '200px', justifyContent: 'center' }} // Adjust the width as needed
              />
            </Box>
            <Box flex={1}>
              <FileUploadAndPreview
                labelName='Photo'
                maxFiles={1}
                color='secondary'
                previewDirection='column'
                buttonStyle={{ width: '200px', justifyContent: 'center' }} // Ensure this matches the width above
              />
            </Box> */}
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
            </Grid>
          </Box>

          <Divider />

          <Box display={"flex"} gap={2} mt={2}>
            <Button
              variant="outlined"
              sx={{ width: "100px" }}
              onClick={() => handleFormClose()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              variant="contained"
              sx={{ width: "100px" }}
            >
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default PatientDashboardAddPartner;
