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

import CustomDatePicker from "../../../../components/CustomDatePicker/CustomDatePicker";
import { useToast } from "../../../../context/ToastContext";
import {
  useEditMasterCryoPreservationMutation,
  useGetMasterCryoPreservationByIdQuery,
} from "../../../../services/masterDashboardService/serviceData/masterCryoPreservationApi";

interface EditMasterCryoPreservationProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  cryoPreservationName: string;
  price: number | 0;
  validTill: Date | null;
  isActive: boolean;
}

const EditMasterCryoPreservation: React.FC<EditMasterCryoPreservationProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  const {
    data: CryoPreservationData,
    isLoading: CryoPreservationLoading,
    isFetching: CryoPreservationFetching,
  } = useGetMasterCryoPreservationByIdQuery(id);

  const data = CryoPreservationData ? CryoPreservationData.data : null;

  const isCryoPreservationLoading =
    CryoPreservationLoading || CryoPreservationFetching;

  console.log("Data at edit Masters", data);

  const initialValues: IFormValues = {
    cryoPreservationName: data?.name || "",
    price: data?.cost || 0,
    validTill: data?.validTill ? new Date(data.validTill) : null,
    isActive: data?.active || false,
  };

  const [editCryoPreservationMutation, { isLoading: isEditing }] =
    useEditMasterCryoPreservationMutation();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      try {
        const cost = values.price || 0;

        const total = cost;

        const payload = {
          id: data?._id,
          name: values.cryoPreservationName,
          cost: cost,
          active: values.isActive,
          total: total,
          validTill: values.validTill,
        };

        const promise = editCryoPreservationMutation(payload).unwrap();
        console.log("Payload", payload);

        showPromiseToast(promise, {
          loading: "Editing CryoPreservation...",
          success: (data) => data || "CryoPreservation Edited Successfully",
          error: (data) => data || "Failed to Edit CryoPreservation",
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
      <DialogTitle color={"primary"}>Edit CryoPreservation</DialogTitle>
      <DialogContent>
        {isCryoPreservationLoading ? (
          <CircularProgress />
        ) : (
          <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={2} mb={2} mt={2}>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  // id="cryoPreservationName"
                  name="cryoPreservationName"
                  label="CryoPreservation Name"
                  value={formik.values.cryoPreservationName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.cryoPreservationName &&
                    Boolean(formik.errors.cryoPreservationName)
                  }
                  helperText={
                    formik.touched.cryoPreservationName &&
                    formik.errors.cryoPreservationName
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
                disabled={isEditing || isCryoPreservationLoading}
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

export default EditMasterCryoPreservation;
