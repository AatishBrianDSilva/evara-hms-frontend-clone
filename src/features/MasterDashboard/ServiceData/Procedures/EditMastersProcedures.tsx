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
  useEditMasterProcedureMutation,
  useGetMasterProcedureByIdQuery,
} from "../../../../services/masterDashboardService/serviceData/masterProceduresApi";

interface EditMasterProcedureProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  procedureName: string;
  price: number | 0;
  validTill: Date | null;
  isActive: boolean;
}

const EditMasterProcedure: React.FC<EditMasterProcedureProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  const {
    data: ProcedureData,
    isLoading: ProcedureLoading,
    isFetching: ProcedureFetching,
  } = useGetMasterProcedureByIdQuery(id);

  const data = ProcedureData ? ProcedureData.data : null;

  const isProcedureLoading = ProcedureLoading || ProcedureFetching;

  console.log("Data at edit Masters", data);

  const initialValues: IFormValues = {
    procedureName: data?.name || "",
    price: data?.cost || 0,
    validTill: data?.validTill ? new Date(data.validTill) : null,
    isActive: data?.active || false,
  };

  const [editProcedureMutation, { isLoading: isEditing }] =
    useEditMasterProcedureMutation();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      try {
        const cost = values.price || 0;

        const total = cost;

        const payload = {
          id: data?._id,
          name: values.procedureName,
          cost: cost,
          active: values.isActive,
          total: total,
          validTill: values.validTill,
        };

        const promise = editProcedureMutation(payload).unwrap();
        console.log("Payload", payload);

        showPromiseToast(promise, {
          loading: "Editing Procedure...",
          success: (data) => data || "Procedure Edited Successfully",
          error: (data) => data || "Failed to Edit Procedure",
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
      <DialogTitle color={"primary"}>Edit Procedure</DialogTitle>
      <DialogContent>
        {isProcedureLoading ? (
          <CircularProgress />
        ) : (
          <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={2} mb={2} mt={2}>
              <Grid item lg={12}>
                <TextField
                  fullWidth
                  // id="itemName"
                  disabled
                  name="masterService"
                  label="Master Procedure"
                  value={data?.procedure.procedureName}
                />
              </Grid>
              <Grid item lg={4}>
                <TextField
                  fullWidth
                  // id="procedureName"
                  name="procedureName"
                  label="Procedure Name"
                  value={formik.values.procedureName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.procedureName &&
                    Boolean(formik.errors.procedureName)
                  }
                  helperText={
                    formik.touched.procedureName && formik.errors.procedureName
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
                disabled={isEditing || isProcedureLoading}
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

export default EditMasterProcedure;
