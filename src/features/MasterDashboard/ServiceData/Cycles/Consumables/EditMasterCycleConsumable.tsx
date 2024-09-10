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
  useGetServiceCycleConsumableByIdQuery,
  useEditServiceCycleConsumableMutation,
} from "../../../../../services/masterDashboardService/serviceData/cycles/masterCyclesConsumablesApi";
import { useToast } from "../../../../../context/ToastContext";


interface EditMasterCycleConsumableProps {
  openModal: boolean;
  onClose: () => void;
  id: string; // Added prop for passing the ID
}

interface IFormValues {
  treatment: string;
}

const EditMasterCycleConsumable: React.FC<EditMasterCycleConsumableProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  const {
    data: cycleConsumableData,
    isLoading: cycleConsumableLoading,
    isFetching: cycleConsumableFetching,
  } = useGetServiceCycleConsumableByIdQuery(id);

  const data = cycleConsumableData ? cycleConsumableData.data : null;

  const isCycleConsumableLoading = cycleConsumableLoading || cycleConsumableFetching;

  const initialValues: IFormValues = {
    treatment: data?.treatment || "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      try {
        const payload = {
          id: data._id,

          treatment: values.treatment,
        };
        const promise = editCycleConsumableMutation(payload).unwrap();

        showPromiseToast(promise, {
          loading: "Editing CycleConsumable...",
          success: (data) => data || "CycleConsumable Edited Successfully",
          error: (data) => data || "Failed to Edit CycleConsumable",
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

  const [editCycleConsumableMutation, { isLoading: isEditing }] =
    useEditServiceCycleConsumableMutation();

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Edit CycleConsumable</DialogTitle>
      <DialogContent>
        <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
          {isCycleConsumableLoading ? <CircularProgress /> : (<Grid container spacing={2} mt={2}>
            <Grid item xs={6} sm={3} lg={3}>
              <TextField
                fullWidth
                id="treatment"
                name="treatment"
                label="Treatment"
                value={formik.values.treatment}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>)}
          <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isEditing || isCycleConsumableLoading}
            >
              {isEditing ? "Saving..." : "Save"}
            </Button>
            <Button variant="contained" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditMasterCycleConsumable;
