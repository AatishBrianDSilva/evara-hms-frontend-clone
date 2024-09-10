import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Skeleton,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import _ from "lodash";
import {
  useGetAppointmentReasonByIdQuery,
  useUpdateAppointmentReasonMutation,
} from "../../../../../services/masterDashboardService/local/appointmentReasonApi";
import { useToast } from "../../../../../context/ToastContext";

interface EditAppointmentReasonProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  name: string;
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

const EditAppointmentReason: React.FC<EditAppointmentReasonProps> = ({
  openModal,
  onClose,
  id,
}) => {
  const { showPromiseToast } = useToast();

  const {
    data: AppointmentReasonData,
    isLoading: AppointmentReasonLoading,
    isFetching: AppointmentReasonFetching,
  } = useGetAppointmentReasonByIdQuery(id);

  // console.log("Id prop", id);

  const data = AppointmentReasonData ? AppointmentReasonData.data : null;

  const isAppointmentReasonLoading = AppointmentReasonLoading || AppointmentReasonFetching;

  // console.log("Data at edit Reason", data);

  const initialValues: IFormValues = {
    name: data?.name || "",
  };

  const [editAppointmentReasonMutation, { isLoading: isEditing }] =
    useUpdateAppointmentReasonMutation();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      try {
        const payload = {
          id: id,
          name: values.name,
        };

        const promise = editAppointmentReasonMutation(payload).unwrap();
        // console.log("Payload", payload);

        showPromiseToast(promise, {
          loading: "Editing Patient Source...",
          success: (data) => data || "Appointment Reason Edited Successfully",
          error: (data) => data || "Failed to Edit Reason",
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
      <DialogTitle color={"primary"}>Edit Appointment Reason</DialogTitle>
      {AppointmentReasonLoading ? (
        skeletonLoader()
      ) : (
        <DialogContent>
          <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={1} mb={2} mt={2}>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Reason"
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
                disabled={isEditing || isAppointmentReasonLoading}
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

export default EditAppointmentReason;
