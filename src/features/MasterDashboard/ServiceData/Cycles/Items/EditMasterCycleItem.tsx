import React from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useToast } from "../../../../../context/ToastContext";
import {
  useEditMasterTreatmentCycleMutation,
  useGetMasterTreatmentCycleByIdQuery,
} from "../../../../../services/masterDashboardService/serviceData/cycles/masterTreatmentCycleApi";
import CustomDatePicker from "../../../../../components/CustomDatePicker/CustomDatePicker";

interface EditMasterCycleItemProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  cycleName: string;
  price: number | 0;
  validTill: Date | null;
  isActive: boolean;
}

const EditMasterCycleItem: React.FC<EditMasterCycleItemProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  const {
    data: CycleItemData,
    isLoading: CycleItemLoading,
    isFetching: CycleItemFetching,
  } = useGetMasterTreatmentCycleByIdQuery(id);

  const data = CycleItemData ? CycleItemData.data : null;

  const isCycleItemLoading = CycleItemLoading || CycleItemFetching;

  console.log("Data at edit Masters", data);

  const initialValues: IFormValues = {
    cycleName: data?.name || "",
    price: data?.cost || 0,
    validTill: data?.validTill ? new Date(data.validTill) : null,
    isActive: data?.active || false,
  };

  const [editCycleItemMutation, { isLoading: isEditing }] =
    useEditMasterTreatmentCycleMutation();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      try {
        const cost = values.price || 0;

        const total = cost;

        const payload = {
          id: data?._id,
          name: values.cycleName,
          cost: cost,
          active: values.isActive,
          total: total,
          validTill: values.validTill,
        };

        const promise = editCycleItemMutation(payload).unwrap();
        console.log("Payload", payload);

        showPromiseToast(promise, {
          loading: "Editing CycleItem...",
          success: (data) => data || "CycleItem Edited Successfully",
          error: (data) => data || "Failed to Edit CycleItem",
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
      <DialogTitle color={"primary"}>Edit CycleItem</DialogTitle>
      <DialogContent>
        {isCycleItemLoading ? (
          <CircularProgress />
        ) : (
          <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={2} mb={2} mt={2}>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  // id="cycleName"
                  name="cycleName"
                  label="Cycle Name"
                  value={formik.values.cycleName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.cycleName && Boolean(formik.errors.cycleName)
                  }
                  helperText={
                    formik.touched.cycleName && formik.errors.cycleName
                  }
                />
              </Grid>

              <Grid item lg={4}>
                <TextField
                  fullWidth
                  id="price"
                  name="price"
                  label="Price"
                  // type="number"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>

              <Grid item lg={4}>
                <CustomDatePicker
                  name="validTill"
                  label="Valid Till"
                  value={formik.values.validTill}
                  onChange={(value) => formik.setFieldValue("validTill", value)}
                />
              </Grid>
              <Grid item lg={4}>
                <FormControlLabel
                  label="Active ?"
                  control={
                    <Checkbox
                      name="isActive"
                      checked={formik.values.isActive}
                      onChange={formik.handleChange}
                    />
                  }
                />
              </Grid>
            </Grid>
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"center"}
              gap={2}
              mb={2}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isEditing || isCycleItemLoading}
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

export default EditMasterCycleItem;
