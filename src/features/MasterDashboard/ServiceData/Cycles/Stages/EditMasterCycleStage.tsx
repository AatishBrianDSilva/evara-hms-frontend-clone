import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import {
  useGetServiceCycleStageByIdQuery,
  useEditServiceCycleStageMutation,
} from "../../../../../services/masterDashboardService/serviceData/cycles/masterCyclesStagesApi";
import { useToast } from "../../../../../context/ToastContext";

interface EditMasterCycleStageProps {
  openModal: boolean;
  onClose: () => void;
  id: string; // Added prop for passing the ID
}

interface IFormValues {
  name: string;
}

const EditMasterCycleStage: React.FC<EditMasterCycleStageProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  const {
    data: cycleStageData,
    isLoading: cycleStageLoading,
    isFetching: cycleStageFetching,
  } = useGetServiceCycleStageByIdQuery(id);

  const data = cycleStageData ? cycleStageData.data : null;
  console.log("Data at edit Masters", data);

  const isCycleStageLoading = cycleStageLoading || cycleStageFetching;

  const initialValues: IFormValues = {
    name: data?.name || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      try {
        const payload = {
          id: data._id,

          name: values.name,
        };
        const promise = editCycleStageMutation(payload).unwrap();

        showPromiseToast(promise, {
          loading: "Editing Cycle Stage...",
          success: (data) => data || "Cycle Stage Edited Successfully",
          error: (data) => data || "Failed to Edit CycleStage",
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
  console.log("testing", id);

  const [editCycleStageMutation, { isLoading: isEditing }] =
    useEditServiceCycleStageMutation();

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Edit Cycle Stage</DialogTitle>
      <DialogContent>
        {isCycleStageLoading ? (<CircularProgress />) : (<Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={6} sm={3} lg={3}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Stage Name"
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
              disabled={isEditing || isCycleStageLoading}
            >
              {isEditing ? "Saving..." : "Save"}
            </Button>
            <Button variant="contained" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditMasterCycleStage;
