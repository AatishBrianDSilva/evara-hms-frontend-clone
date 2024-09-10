import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Skeleton,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import _ from "lodash";
import { useGetDoctorByIdQuery, useUpdateDoctorMutation } from "../../../../services/doctorsApi";
import { useToast } from "../../../../context/ToastContext";
import CustomDatePicker from "../../../../components/CustomDatePicker/CustomDatePicker";
import FieldAutocomplete from "../../../../components/FieldAutoComplete/FieldAutoComplete";

interface EditDoctorProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  addressLine1: string;
  addressLine2: string;
  branchId: string;
  city: string;
  clinicId: string;
  // designation: string;
  dob: Date | null;
  education: string;
  email: string;
  firstName: string;
  gender: string;
  image: string;
  lastName: string;
  licenceNumber: string;
  mobile: string;
  pincode: string;
  state: string;
  speciality: string;
  status: "active" | "inactive";
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
        <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2}>
          <Skeleton variant="rectangular" width={90} height={36} />
          <Skeleton variant="rectangular" width={90} height={36} />
        </Box>
      </Box>
    </DialogContent>
  );
};

const EditGlobalConsultant: React.FC<EditDoctorProps> = ({ openModal, onClose, id }) => {
  const { showPromiseToast } = useToast();

  const {
    data: DoctorData,
    isLoading: DoctorLoading,
    isFetching: DoctorFetching,
  } = useGetDoctorByIdQuery(id);

  // console.log("Id prop", id);

  const data = DoctorData ? DoctorData.data : null;

  const isDoctorLoading = DoctorLoading || DoctorFetching;

  // console.log("Data at edit Masters", data);

  const initialValues: IFormValues = {
    clinicId: data?.clinicId || "",
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    mobile: data?.mobile || "",
    city: data?.city || "",
    // designation: data?.designation || "",
    speciality: data?.speciality || "",
    dob: data?.dob ? new Date(data.dob) : null,
    education: data?.education || "",
    email: data?.email || "",
    gender: data?.gender || "",
    image: data?.image || "",
    branchId: data?.branchId || "",
    licenceNumber: data?.licenceNumber || "",
    addressLine1: data?.addressLine1 || "",
    addressLine2: data?.addressLine2 || "",
    pincode: data?.pincode || "",
    state: data?.state || "",
    status: data?.status === "active" || data?.status === "inactive" ? data.status : "active",
  };

  const [editDoctorMutation, { isLoading: isEditing }] = useUpdateDoctorMutation();

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

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      try {
        const payload = {
          id: id,
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2,
          branchId: values.branchId,
          city: values.city,
          clinicId: values.clinicId,
          // designation: values.designation,
          dob: values.dob,
          education: values.education,
          email: values.email,
          firstName: values.firstName,
          gender: values.gender,
          image: values.image,
          lastName: values.lastName,
          licenceNumber: values.licenceNumber,
          mobile: values.mobile,
          pincode: values.pincode,
          state: values.state,
          status: values.status,
          speciality: values.speciality,
          global: true,
        };

        const promise = editDoctorMutation(payload).unwrap();
        // console.log("Payload", payload);

        showPromiseToast(promise, {
          loading: "Editing Doctor...",
          success: (data) => data || "Doctor Edited Successfully",
          error: (data) => data || "Failed to Edit User",
        });

        await promise;
        onClose();
      } catch (error) {
        console.error("Edit failed:", error);
      }
    },
    // validationSchema: validationSchema,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Edit Referral Doctor</DialogTitle>
      {DoctorLoading ? (
        skeletonLoader()
      ) : (
        <DialogContent>
          <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={1} mb={2} mt={2}>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="licenceNumber"
                  name="licenceNumber"
                  label="Licence Number Name"
                  value={formik.values.licenceNumber}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="clinicId"
                  name="clinicId"
                  label="Clinic Id"
                  value={formik.values.clinicId}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="branchId"
                  name="branchId"
                  label="Branch Id"
                  value={formik.values.branchId}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="mobile"
                  name="mobile"
                  label="Mobile"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <CustomDatePicker
                  name="dob"
                  label="Date of Birth"
                  value={formik.values.dob}
                  onChange={(value) => formik.setFieldValue("dob", value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              {/* <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="designation"
                  name="designation"
                  label="Designation"
                  value={formik.values.designation}
                  onChange={formik.handleChange}
                />
              </Grid> */}
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  select
                  name="speciality"
                  label="Speciality"
                  value={formik.values.speciality}
                  onChange={formik.handleChange}
                  error={formik.touched.speciality && Boolean(formik.errors.speciality)}
                  helperText={formik.touched.speciality && formik.errors.speciality}
                  fullWidth
                >
                  <MenuItem value="Reproductive Endocrinologist">
                    Reproductive Endocrinologist
                  </MenuItem>
                  <MenuItem value="Andrologist">Andrologist</MenuItem>
                  <MenuItem value="Embryologist">Embryologist</MenuItem>
                  <MenuItem value="Urologist">Urologist</MenuItem>
                  <MenuItem value="Reproductive Surgeon">Reproductive Surgeon</MenuItem>
                  <MenuItem value="Gynecologist">Gynecologist</MenuItem>
                  <MenuItem value="Fertility Counselor">Fertility Counselor</MenuItem>
                  <MenuItem value="Genetic Counselor">Genetic Counselor</MenuItem>
                  <MenuItem value="Nurse Practitioner/Registered Nurse">
                    Nurse Practitioner/Registered Nurse
                  </MenuItem>
                  <MenuItem value="Sonographer">Sonographer</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="education"
                  name="education"
                  label="Education"
                  value={formik.values.education}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  select
                  fullWidth
                  id="gender"
                  name="gender"
                  label="Gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="addressLine1"
                  name="addressLine1"
                  label="Address Line 1"
                  value={formik.values.addressLine1}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="addressLine2"
                  name="addressLine2"
                  label="Address Line 2"
                  value={formik.values.addressLine2}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="city"
                  name="city"
                  label="City"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} mb={2}>
              <Grid item xs={8} sm={4} lg={3}>
                <FieldAutocomplete
                  label="State"
                  options={indianStates}
                  isOptionEqualToValue={(option, value) => option === value}
                  getOptionLabel={(option) => option}
                  value={formik.values.state}
                  onChange={(value) => {
                    formik.setFieldValue("state", value);
                  }}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="pincode"
                  name="pincode"
                  label="Pincode"
                  value={formik.values.pincode}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="image"
                  name="image"
                  label="Image URL"
                  value={formik.values.image}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.status === "active"}
                      onChange={(e) =>
                        formik.setFieldValue("status", e.target.checked ? "active" : "inactive")
                      }
                    />
                  }
                  label="Active ?"
                />
              </Grid>
            </Grid>
            <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isEditing || isDoctorLoading}
              >
                {isEditing ? "Saving..." : "Save"}
              </Button>
              <Button variant="contained" color="secondary" onClick={onClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default EditGlobalConsultant;
