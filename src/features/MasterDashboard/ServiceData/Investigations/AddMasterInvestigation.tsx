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
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import _ from "lodash";

import {
  useGetMasterDefaultInvestigationsQuery,
  useAddMasterInvestigationMutation,
} from "../../../../services/masterDashboardService/serviceData/masterInvestigationApi";
import { useToast } from "../../../../context/ToastContext";
import CustomDatePicker from "../../../../components/CustomDatePicker/CustomDatePicker";
import FieldAutocomplete from "../../../../components/FieldAutoComplete/FieldAutoComplete";

interface AddMasterInvestigationProps {
  openModal: boolean;
  onClose: () => void;
}

interface IFormValues {
  default: any | null;
  itemName: string;
  itemId: string;
  price: number;
  validTill: Date | null;
  isActive: boolean;
}

const AddMasterInvestigation: React.FC<AddMasterInvestigationProps> = ({
  openModal,
  onClose,
}) => {
  const { showPromiseToast } = useToast();

  //fetching default data
  const {
    data: defaultInvestigationsData,
    isLoading: isDefaultInvestigationsLoading,
    isFetching: isDefaultInvestigationFetching,
  } = useGetMasterDefaultInvestigationsQuery({
    paginate: false,
    filters: { isAdmin: true },
  });

  const defaultInvestigations = defaultInvestigationsData?.data || [];
  const defaultInvestigationsLoading =
    isDefaultInvestigationsLoading || isDefaultInvestigationFetching;

  const [addInvestigation, { isLoading }] = useAddMasterInvestigationMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    const total = values.price;

    const payload = {
      testType: values.default.testType,
      test: values.default._id,
      name: values.itemName,
      gender: values.default.gender,
      cost: values.price,
      description: values.default.description,
      active: values.isActive,
      total: total,
      validTill: values.validTill,
    };

    console.log("Payload to be submitted:", payload); // Log the payload

    // Add your submission logic here, including tax
    // Extract tax from values
    const promise = addInvestigation(payload).unwrap();

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
    default: null,
    itemName: "",
    itemId: "",
    price: 0,
    isActive: true,
    validTill: null,
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleFormSubmit,
    enableReinitialize: true,
  });

  return (
    <Dialog open={openModal} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle color={"primary"}>Add Master Investigation</DialogTitle>
      <DialogContent>
        <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2} alignItems="center">
            <Grid item xs={12} sm={6} lg={4}>
              <FieldAutocomplete
                label="Master Investigation"
                options={defaultInvestigations}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                getOptionLabel={(option) => option.testName}
                loading={defaultInvestigationsLoading}
                value={formik.values.default}
                onChange={(value) => {
                  formik.setFieldValue("default", value);
                  formik.setFieldValue("itemName", value?.testName || "");
                  formik.setFieldValue("itemId", value?.testId || "");
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={6} sm={3} lg={3}>
              <TextField
                fullWidth
                id="itemName"
                name="itemName"
                label="Investigation Name"
                helperText={"Investigation name must be unique"}
                value={formik.values.itemName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6} sm={3} lg={2}>
              <TextField
                fullWidth
                id="itemId"
                name="itemId"
                label="Item ID"
                value={formik.values.itemId}
                onChange={formik.handleChange}
                disabled
              />
            </Grid>
            <Grid item xs={6} sm={3} lg={3}>
              <TextField
                fullWidth
                id="price"
                name="price"
                label="Price"
                value={formik.values.price}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6} sm={3} lg={3}>
              <CustomDatePicker
                name="validTill"
                label="Valid Till"
                value={formik.values.validTill}
                onChange={(value) => formik.setFieldValue("validTill", value)}
              />
            </Grid>
            {/* <Grid item xs={6} sm={3} lg={2}>
              <TextField
                fullWidth
                id="tax"
                name="tax"
                label="Tax"
                value={formik.values.tax}
                onChange={formik.handleChange}
              />
            </Grid> */}
            <Grid item xs={6} sm={3} lg={2}>
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

export default AddMasterInvestigation;
