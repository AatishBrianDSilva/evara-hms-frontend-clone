import React from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import _ from "lodash";
import { useToast } from "../../../../context/ToastContext";
import { useAddConsentMutation } from "../../../../services/masterDashboardService/local/consentApi";

interface AddConsentProps {
  openModal: boolean;
  onClose: () => void;
}
interface IFormValues {
  name: string;
  purpose: string;
  associatedWith: string;
  file: string;
}

const AddConsent: React.FC<AddConsentProps> = ({ openModal, onClose }) => {
  const { showPromiseToast } = useToast();

  const [addConsent, { isLoading: ConsentLoading }] = useAddConsentMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    const payload = {
      name: values.name,
      purpose: values.purpose,
      associatedWith: values.associatedWith,
      file: values.file,
    };

    // console.log("Payload to be submitted:", payload); // Log the payload

    const promise = addConsent(payload).unwrap();

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
    purpose: "",
    associatedWith: "",
    file: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    // validationSchema: validationSchema,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Add Consent</DialogTitle>
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
                id="purpose"
                name="purpose"
                label="Purpose"
                value={formik.values.purpose}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="associatedWith"
                name="associatedWith"
                label="Associated With"
                value={formik.values.associatedWith}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4} lg={3}>
              <TextField
                fullWidth
                id="file"
                name="file"
                label="File"
                value={formik.values.file}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>

          <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={ConsentLoading || _.isEqual(initialValues, formik.values)}
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

export default AddConsent;
