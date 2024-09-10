import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import _ from "lodash";

import { useToast } from "../../../../../context/ToastContext";
import { useAddServiceCycleStageMutation } from "../../../../../services/masterDashboardService/serviceData/cycles/masterCyclesStagesApi";

interface AddMasterCycleStageProps {
  openModal: boolean;
  onClose: () => void;
}

interface IFormValues {
  name: string
}

const AddMasterCycleStage: React.FC<AddMasterCycleStageProps> = ({
  openModal,
  onClose,
}) => {
  const { showPromiseToast } = useToast();


  // const cycleStages = cycleStagesData?.data || [];
  const [addCycleStage, { isLoading }] = useAddServiceCycleStageMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    console.log("Form values submitted", values);

    const payload = {
      name: values.name,
    };

    console.log("Payload to be submitted:", payload); // Log the payload

    // Add your submission logic here, including tax
    // Extract tax from values
    const promise = addCycleStage(payload).unwrap();

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
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Add Cycle Stage</DialogTitle>
      <DialogContent>
        <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={6} sm={3} lg={3}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Stage"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
          <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={_.isEqual(initialValues, formik.values) || isLoading}
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

export default AddMasterCycleStage;

