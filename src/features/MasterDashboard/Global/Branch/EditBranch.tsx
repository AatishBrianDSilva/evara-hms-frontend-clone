import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Skeleton,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import _ from "lodash";
import {
  useGetGlobalBranchByIdQuery,
  useEditGlobalBranchMutation,
} from "../../../../services/masterDashboardService/global/globalBranch";
import { useToast } from "../../../../context/ToastContext";
import FieldAutocomplete from "../../../../components/FieldAutoComplete/FieldAutoComplete";

interface EditBranchProps {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

interface IFormValues {
  code: string;
  branchName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  manager: string;
  phone: string;
  email: string;
  isActive: boolean;
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

const EditBranch: React.FC<EditBranchProps> = ({ openModal, onClose, id }) => {
  const { showPromiseToast } = useToast();

  const {
    data: BranchData,
    isLoading: BranchLoading,
    isFetching: BranchFetching,
  } = useGetGlobalBranchByIdQuery(id);

  // console.log("Id prop", id);

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry",
    "Ladakh",
    "Jammu and Kashmir",
  ];

  const data = BranchData ? BranchData.data : null;

  const isBranchLoading = BranchLoading || BranchFetching;

  // console.log("Data at edit Masters", data);

  const initialValues: IFormValues = {
    code: data?.code || "",
    branchName: data?.branchName || "",
    street: data?.address?.street || "",
    city: data?.address?.city || "",
    state: data?.address?.state || "",
    zip: data?.address?.zip || "",
    manager: data?.manager || "",
    phone: data?.phone || "",
    email: data?.email || "",
    isActive: data?.isActive || false,
  };

  const [editBranchMutation, { isLoading: isEditing }] = useEditGlobalBranchMutation();

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      try {
        const branchData = {
          _id: id,
          clinicId: data?.clinicId,
          code: values.code,
          branchName: values.branchName,
          address: {
            street: values.street,
            city: values.city,
            state: values.state,
            zip: values.zip,
          },
          manager: values.manager,
          phone: values.phone,
          email: values.email,
          isActive: values.isActive,
        };

        const promise = editBranchMutation({ id, branchData }).unwrap();
        console.log("Payload", branchData);

        showPromiseToast(promise, {
          loading: "Editing Branch...",
          success: (data) => data || "Branch Edited Successfully",
          error: (data) => data || "Failed to Edit Branch",
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
      <DialogTitle color={"primary"}>Edit Branch </DialogTitle>
      {isBranchLoading ? (
        skeletonLoader()
      ) : (
        <DialogContent>
          <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
            <Grid container spacing={2} mb={2} mt={2}>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="code"
                  name="code"
                  label="Branch Code"
                  placeholder="Branch Code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="branchName"
                  name="branchName"
                  label="Branch Name"
                  placeholder="Branch Name"
                  value={formik.values.branchName}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="street"
                  name="street"
                  label="Street"
                  placeholder="Street"
                  value={formik.values.street}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="city"
                  name="city"
                  label="City"
                  placeholder="City"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <FieldAutocomplete
                  label="State"
                  options={indianStates}
                  isOptionEqualToValue={(option, value) => option === value}
                  getOptionLabel={(option) => option}
                  value={formik.values.state}
                  onChange={(value) => {
                    formik.setFieldValue("state", value);
                  }}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="zip"
                  name="zip"
                  label="Zip"
                  placeholder="Zip"
                  value={formik.values.zip}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="manager"
                  name="manager"
                  label="Manager"
                  placeholder="Manager"
                  value={formik.values.manager}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone"
                  placeholder="Phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4} lg={3}>
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
            <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} gap={2} mb={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isEditing || isBranchLoading}
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

export default EditBranch;
