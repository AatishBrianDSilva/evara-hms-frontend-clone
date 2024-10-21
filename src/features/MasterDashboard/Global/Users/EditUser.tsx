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
  useEditGlobalUserMutation,
  useGetGlobalUserByIdQuery,
} from "../../../../services/masterDashboardService/global/globalUser";
import { useToast } from "../../../../context/ToastContext";
import { EUserRole } from "../../../../types/masterDashboard/global";

interface EditUserProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  clinicId: string;
  branchId: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  role: string;
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

const EditUser: React.FC<EditUserProps> = ({ openModal, onClose, id }) => {
  const { showPromiseToast } = useToast();

  const {
    data: UserData,
    isLoading: UserLoading,
    isFetching: UserFetching,
  } = useGetGlobalUserByIdQuery(id);

  // console.log("Id prop", id);

  const data = UserData ? UserData.data : null;

  const isUserLoading = UserLoading || UserFetching;

  // console.log("Data at edit Masters", data);

  const initialValues: IFormValues = {
    clinicId: data?.clinicId || "",
    username: data?.username || "",
    email: data?.email || "",
    password: data?.password || "",
    phone: data?.phone || "",
    role: data?.role || "",
    branchId: data?.branchId || "",
  };

  const [editUserMutation, { isLoading: isEditing }] = useEditGlobalUserMutation();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      try {
        const payload = {
          userId: id,
          username: values.username,
          email: values.email,
          role: values.role,
          phone: values.phone,
        };

        const promise = editUserMutation(payload).unwrap();
        // console.log("Payload", payload);

        showPromiseToast(promise, {
          loading: "Editing User...",
          success: (data) => data || "User Edited Successfully",
          error: (data) => data || "Failed to Edit User",
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
      <DialogTitle color={"primary"}>Edit User</DialogTitle>
      {isUserLoading ? (
        skeletonLoader()
      ) : (
        <DialogContent>
          <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={2} mb={2} mt={2}>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="clinicId"
                  name="clinicId"
                  label="Clinic ID"
                  disabled
                  value={formik.values.clinicId}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="branchId"
                  name="branchId"
                  label="Branch ID"
                  disabled
                  value={formik.values.branchId}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
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
                  select
                  fullWidth
                  id="role"
                  name="role"
                  label="Role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                >
                  {Object.values(EUserRole).map((role) => (
                    <MenuItem key={role} value={role}>
                      {_.kebabCase(role)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isEditing || isUserLoading}
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

export default EditUser;
