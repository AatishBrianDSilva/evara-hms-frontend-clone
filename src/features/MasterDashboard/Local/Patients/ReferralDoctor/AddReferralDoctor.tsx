import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import _ from "lodash";
import { useToast } from "../../../../../context/ToastContext";
import { useAddReferralDoctorMutation } from "../../../../../services/masterDashboardService/local/referralDoctorApi";

interface AddDoctorProps {
  openModal: boolean;
  onClose: () => void;
}
interface IFormValues {
  name: string;
  phone: string;
  city: string;
  speciality: string;
}

const AddLocalReferralDoctor: React.FC<AddDoctorProps> = ({ openModal, onClose }) => {
  const { showPromiseToast } = useToast();

  const [addDoctor, { isLoading: DoctorLoading }] = useAddReferralDoctorMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    const payload = {
      name: values.name,
      phone: values.phone,
      city: values.city,
      speciality: values.speciality,
      // global: true,
    };

    // console.log("Payload to be submitted:", payload); // Log the payload

    const promise = addDoctor(payload).unwrap();

    showPromiseToast(promise, {
      loading: "Adding...",
      success: (data) => data || "Added Successfully",
      error: (data) => data || "Adding Failed",
    });

    try {
      await promise;
    } catch (error) {
      console.log(error);
    }

    onClose();
  };

  const initialValues: IFormValues = {
    name: "",
    phone: "",
    city: "",
    speciality: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    // validationSchema: validationSchema,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Add Referral Doctors</DialogTitle>
      <DialogContent>
        <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={1} mb={2} mt={2}>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone"
                value={formik.values.phone}
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
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="speciality"
                name="speciality"
                select
                label="Speciality"
                value={formik.values.speciality}
                onChange={formik.handleChange}
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
          </Grid>

          <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={DoctorLoading || _.isEqual(initialValues, formik.values)}
              sx={{ width: "fit-content" }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "fit-content" }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocalReferralDoctor;
