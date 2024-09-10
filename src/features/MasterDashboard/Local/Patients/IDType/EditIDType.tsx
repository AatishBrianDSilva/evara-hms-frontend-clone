import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Skeleton,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import _ from "lodash";
import {
  useGetPatientIdTypeByIdQuery,
  useUpdatePatientIdTypeMutation,
} from "../../../../../services/masterDashboardService/local/patientIdTypeApi";
import { useToast } from "../../../../../context/ToastContext";

interface EditIDTypeProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  name: string;
  format: string;
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

const EditIDType: React.FC<EditIDTypeProps> = ({ openModal, onClose, id }) => {
  const { showPromiseToast } = useToast();

  const {
    data: IDTypeData,
    isLoading: IDTypeLoading,
    isFetching: IDTypeFetching,
  } = useGetPatientIdTypeByIdQuery(id);

  // console.log("Id prop", id);

  const data = IDTypeData ? IDTypeData.data : null;

  const isIDTypeLoading = IDTypeLoading || IDTypeFetching;

  // console.log("Data at edit ID types", data);

  const initialValues: IFormValues = {
    name: data?.name || "",
    format: data?.format || "",
  };

  const [editIDTypeMutation, { isLoading: isEditing }] = useUpdatePatientIdTypeMutation();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      try {
        const payload = {
          id: id,
          name: values.name,
          format: values.format,
          // global: false,
        };

        const promise = editIDTypeMutation(payload).unwrap();
        // console.log("Payload", payload);

        showPromiseToast(promise, {
          loading: "Editing IDType...",
          success: (data) => data || "IDType Edited Successfully",
          error: (data) => data || "Failed to Edit ID Type",
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
      <DialogTitle color={"primary"}>Edit ID Type</DialogTitle>
      {IDTypeLoading ? (
        skeletonLoader()
      ) : (
        <DialogContent>
          <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={1} mb={2} mt={2}>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  select
                  id="name"
                  name="name"
                  label="ID Type"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="Aadhar Card">Aadhar Card</MenuItem>
                  {/* <MenuItem value="Passport">Passport</MenuItem> */}
                  <MenuItem value="Driving License">Driving License</MenuItem>
                  <MenuItem value="Voter ID">Voter ID</MenuItem>
                  <MenuItem value="PAN Card">PAN Card</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="format"
                  name="format"
                  label="Format"
                  value={formik.values.format}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
            <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isEditing || isIDTypeLoading}
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

export default EditIDType;
