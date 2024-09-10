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
import { useToast } from "../../../../../context/ToastContext";
import {
  useAddMasterTreatmentCycleMutation,
  useGetMasterDefaultTreatmentCycleQuery,
} from "../../../../../services/masterDashboardService/serviceData/cycles/masterTreatmentCycleApi";
import FieldAutocomplete from "../../../../../components/FieldAutoComplete/FieldAutoComplete";
import CustomDatePicker from "../../../../../components/CustomDatePicker/CustomDatePicker";

interface AddMasterCycleItemProps {
  openModal: boolean;
  onClose: () => void;
}

interface IFormValues {
  default: any | null;
  cycleName: string;
  cycleId: string;
  price: number;
  validTill: Date | null;
  isActive: boolean;
}

const AddMasterCycleItem: React.FC<AddMasterCycleItemProps> = ({
  openModal,
  onClose,
}) => {
  const { showPromiseToast } = useToast();

  //fetching default data
  const {
    data: defaultCycleItemsData,
    isLoading: isDefaultCycleItemsLoading,
    isFetching: isDefaultCycleItemFetching,
  } = useGetMasterDefaultTreatmentCycleQuery({
    paginate: false,
    filters: { isAdmin: true },
  });

  const defaultCycleItems = defaultCycleItemsData?.data || [];
  const defaultCycleItemsLoading =
    isDefaultCycleItemsLoading || isDefaultCycleItemFetching;

  const [addCycleItem, { isLoading }] = useAddMasterTreatmentCycleMutation();

  const handleFormSubmit = async (values: IFormValues) => {
    const total = values.price;

    const payload = {
      cycleType: values.default.cycleType,
      treatmentCycle: values.default._id,
      name: values.cycleName,
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
    const promise = addCycleItem(payload).unwrap();

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
    cycleName: "",
    cycleId: "",
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
      <DialogTitle color={"primary"}>Add Master CycleItem</DialogTitle>
      <DialogContent>
        <Box component={"form"} onSubmit={formik.handleSubmit} p={2}>
          <Grid container spacing={2} mb={2} mt={2} alignItems="center">
            <Grid item xs={12} sm={6} lg={4}>
              <FieldAutocomplete
                label="Master CycleItem"
                options={defaultCycleItems}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                getOptionLabel={(option) => option.cycleName}
                loading={defaultCycleItemsLoading}
                value={formik.values.default}
                onChange={(value) => {
                  formik.setFieldValue("default", value);
                  formik.setFieldValue("cycleName", value?.cycleName || "");
                  formik.setFieldValue("cycleId", value?.cycleId || "");
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={6} sm={3} lg={3}>
              <TextField
                fullWidth
                id="cycleName"
                name="cycleName"
                label="Cycle Name"
                helperText={"Cycle name must be unique"}
                value={formik.values.cycleName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={6} sm={3} lg={2}>
              <TextField
                fullWidth
                id="cycleId"
                name="cycleId"
                label="Cycle ID"
                value={formik.values.cycleId}
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

export default AddMasterCycleItem;
